import { ApiQueryProps } from "../types/query-schema";
import { StreamDecoder } from "./stream-decoder";

export type StreamSubscriberProps = {
  queryProps: ApiQueryProps;
  swr: boolean;
  onData: (chunk: any) => void;
  onError: (err: Error) => void;
  onComplete: () => void;
};

/**
 * Subscribes to an NDJSON stream served by `/api/next-query/swr` or `/cache`,
 * and processes the stream via a `StreamDecoder`.
 */
export class StreamSubscriber {
  private readonly controller = new AbortController();
  private readonly swrHandlerPath = "/api/next-query/swr";
  private readonly cacheHandlerPath = "/api/next-query/cache";

  constructor(private readonly props: StreamSubscriberProps) {}

  /**
   * Initiates the NDJSON fetch stream and decoding process.
   * Automatically invokes lifecycle callbacks on data, error, or completion.
   */
  public async start(): Promise<void> {
    try {
      const stream = await this.fetchStream(this.props.queryProps);
      const decoder = new StreamDecoder(this.props.onData, this.props.onError);

      await decoder.decode(stream);

      this.props.onComplete();
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        this.props.onError(err instanceof Error ? err : new Error(String(err)));
      }
    }
  }

  /**
   * Cancels the fetch and decoding pipeline.
   */
  public stop(): void {
    this.controller.abort();
  }

  /**
   * Selects the correct endpoint and performs a streaming POST request.
   *
   * @param queryProps - The request parameters to pass to the API.
   * @returns A readable stream of NDJSON content.
   * @throws If the response is not OK or streaming is unsupported.
   */
  private async fetchStream(queryProps: ApiQueryProps): Promise<ReadableStream<Uint8Array>> {
    const endpoint = this.props.swr ? this.swrHandlerPath : this.cacheHandlerPath;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryProps }),
      signal: this.controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Stream request failed: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("Streaming not supported in this environment");
    }

    return response.body;
  }
}
