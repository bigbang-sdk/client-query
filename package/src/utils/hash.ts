/**
 * Generate a stable tag from a string using FNV-1a (32-bit) → base36.
 *
 * @param input The string to hash (e.g. URL).
 * @returns An 8-character base36 hash.
 */
export const getHash = (input: string): string => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36).padStart(8, "0");
};
