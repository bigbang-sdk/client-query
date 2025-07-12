import { NDJSON } from "../ndjson";

/**
 * Streams UTF-8 text chunks as NDJSON, using a transform stream and backpressure support.
 * Designed for server streaming APIs like Next.js route handlers.
 */
export class StreamEncoder {
  /** The readable side that emits encoded Uint8Array chunks. */
  public readonly stream: ReadableStream<Uint8Array>;

  /** Internal writer for enqueueing UTF-8 strings into the stream. */
  private readonly writer: WritableStreamDefaultWriter<string>;

  /**
   * @param encoder - Optional `TextEncoder`, defaults to UTF-8.
   */
  constructor(private readonly encoder: TextEncoder = new TextEncoder()) {
    const { readable, writable } = new TransformStream<string, Uint8Array>({
      transform: (chunk, controller) => {
        controller.enqueue(this.encoder.encode(chunk));
      },
    });

    this.stream = readable;
    this.writer = writable.getWriter();
  }

  /**
   * Creates a `Response` object wrapping the encoded stream.
   *
   * @returns A Fetch-compatible `Response` with NDJSON headers.
   */
  public initiateStream(): Response {
    return new Response(this.stream, {
      status: 200,
      headers: NDJSON.HEADERS,
    });
  }

  /**
   * Enqueues a new text chunk into the stream.
   *
   * @param chunk - The text string to encode and stream.
   * @returns A promise that resolves once the writer accepts the chunk.
   */
  public sendChunk(chunk: string): Promise<void> {
    return this.writer.write(chunk);
  }

  /**
   * Gracefully closes the stream, signaling the end of output.
   *
   * @returns A promise that resolves when the writer is closed.
   */
  public close(): Promise<void> {
    return this.writer.close();
  }

  /**
   * Immediately aborts the stream and signals a failure to consumers.
   *
   * @param reason - Optional error or message explaining the abort.
   */
  public abort(reason?: unknown): void {
    this.writer.abort(reason);
  }
}
