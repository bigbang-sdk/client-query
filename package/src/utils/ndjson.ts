/**
 * Utility for generating NDJSON-compatible responses.
 */
export const NDJSON = {
  /**
   * Standard headers for NDJSON streams.
   */
  HEADERS: {
    "Content-Type": "application/x-ndjson; charset=utf-8",
  } as const,

  /**
   * Returns a `Response` object containing a single NDJSON-formatted error line.
   *
   * @param message - The error message to include.
   * @param status - HTTP status code (default: 404).
   * @returns A `Response` with proper NDJSON headers and error payload.
   */
  errorResponse(message: string, status: number = 404): Response {
    const payload = JSON.stringify({ success: false, error: message }) + "\n";
    return new Response(payload, {
      status,
      headers: NDJSON.HEADERS,
    });
  },
};
