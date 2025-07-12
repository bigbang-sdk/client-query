/**
 * Decodes an NDJSON text stream into parsed objects.
 *
 * @template T - The expected shape of each `data` payload.
 */
export class StreamDecoder<T> {
  private buffer = "";

  /**
   * @param onData - Invoked for each successfully parsed `data` chunk.
   * @param onError - Invoked for any parse or protocol-level error.
   */
  constructor(private readonly onData: (chunk: T) => void, private readonly onError: (err: Error) => void) {}

  /**
   * Reads from a stream of NDJSON text, splits lines, parses JSON,
   * and calls `onData` or `onError` appropriately.
   *
   * @param body - The raw byte stream to decode.
   */
  public async decode(body: ReadableStream<Uint8Array>): Promise<void> {
    const textStream = body.pipeThrough(new TextDecoderStream());
    const reader = textStream.getReader();

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        if (value) {
          this.buffer += value;
          const parts = this.buffer.split("\n");

          // keep the incomplete line in buffer
          this.buffer = parts.pop() ?? "";

          for (const line of parts) {
            this.parseLine(line);
          }
        }
      }

      // flush remaining buffer
      if (this.buffer.trim()) {
        this.parseLine(this.buffer);
      }
    } catch (err: any) {
      this.onError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Parses a single NDJSON line and calls appropriate callbacks.
   *
   * @param line - The JSON string to parse.
   */
  private parseLine(line: string): void {
    if (!line.trim()) return;

    try {
      const parsed = JSON.parse(line);
      if (parsed.success) {
        this.onData(parsed.data as T);
      } else {
        this.onError(new Error(parsed.error ?? "Unknown error"));
      }
    } catch (e: any) {
      this.onError(new Error(`JSON parse error: ${e.message}`));
    }
  }
}
