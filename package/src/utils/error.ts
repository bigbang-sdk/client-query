/**
 * Extracts a human-readable message from an unknown error.
 *
 * @param error – The error to unwrap.
 * @returns The error’s message, or a stringified value, or a fallback.
 */
export function parseErrorMessage(error: unknown): string {
  // Native Error instances
  if (error instanceof Error) {
    return error.message;
  }

  // Plain strings
  if (typeof error === "string") {
    return error;
  }

  // Objects with a `message` property
  if (error !== null && typeof error === "object" && "message" in error && typeof (error as any).message === "string") {
    return (error as any).message;
  }

  // Fallback to string conversion (handles numbers, booleans, etc.)
  const str = String(error);
  return str.length > 0 ? str : "Unknown error";
}
