import { StreamEncoder } from "./stream-encoder";
import { parseErrorMessage } from "../error";
import { RequestOptions, RequestResponse } from "../types/request";

/**
 * Streams a two-phase fetch process (cache-first and optionally revalidated)
 * as newline-delimited JSON (NDJSON). Useful for SWR-style hydration.
 *
 * @template T - The expected JSON response shape.
 */
export class StreamProducer<T = unknown> {
  private readonly encoder = new StreamEncoder();
  private readonly controller = new AbortController();
  private readonly init: RequestOptions;

  /**
   * @param url        - The request URL.
   * @param options    - Fetch options (`method`, `headers`, etc.).
   * @param invalidate - Function to invalidate Next.js cache tags.
   * @param swr        - Whether to perform stale-while-revalidate.
   */
  constructor(private readonly url: string, options: RequestOptions = {}, private readonly invalidate: (tag: string) => void, private readonly swr: boolean) {
    this.init = options;
    this.run();
  }

  /**
   * Starts the fetch stream process:
   * 1. Fetch cached data
   * 2. Send cached chunk
   * 3. If `swr`, invalidate tags, refetch, and optionally send updated chunk
   * 4. Close stream
   */
  private async run(): Promise<void> {
    try {
      const cachedData = await this.resolveFetch();
      await this.sendChunk({ success: true, data: cachedData });

      if (this.swr) {
        for (const tag of this.init.next?.tags ?? []) {
          this.invalidate(tag);
        }

        const freshData = await this.resolveFetch();
        const isEqual = JSON.stringify(cachedData) === JSON.stringify(freshData);

        if (!isEqual) {
          await this.sendChunk({ success: true, data: freshData });
        }
      }
    } catch (err: unknown) {
      await this.sendChunk({
        success: false,
        error: parseErrorMessage(err),
      });
    } finally {
      this.encoder.close();
    }
  }

  /**
   * Performs a single fetch using the initialized options.
   *
   * @returns The parsed JSON response.
   * @throws If the response status is not OK.
   */
  private async resolveFetch(): Promise<T> {
    const res = await fetch(this.url, {
      ...this.init,
      signal: this.controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  /**
   * Serializes a single message and sends it as a line to the stream.
   *
   * @param msg - A success or error NDJSON payload.
   * @returns A Promise that resolves when the chunk is sent.
   */
  private sendChunk(msg: RequestResponse): Promise<void> {
    return this.encoder.sendChunk(`${JSON.stringify(msg)}\n`);
  }

  /**
   * Creates a `Response` object from the internal encoder's stream.
   *
   * @returns A Fetch-compatible NDJSON stream response.
   */
  public initiateStream(): Response {
    return this.encoder.initiateStream();
  }

  /**
   * Aborts any ongoing fetch and closes the NDJSON stream.
   *
   * @param reason - Optional reason for aborting.
   */
  public abort(reason?: unknown): void {
    this.controller.abort(reason);
    this.encoder.abort(reason);
  }
}
