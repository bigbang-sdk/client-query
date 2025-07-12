/**
 * The shape of an NDJSON‐streamed response:
 * - On success: `{ success: true; data: T }`
 * - On failure: `{ success: false; error: string }`
 *
 * @template T The type of the `data` payload when `success` is `true`.
 */
export type RequestResponse<T = unknown> = { readonly success: true; readonly data: T } | { readonly success: false; readonly error: string };

/**
 * Fetch options extended for Next.js (App Router) support.
 */
export interface RequestOptions extends RequestInit {
  /**
   * Next.js–specific fetch directives:
   * - `revalidate`: number of seconds before ISR revalidation, or `false` to disable.
   * - `tags`: cache tags for `revalidateTag()` workflows.
   * - Additional keys are allowed for future Next.js options.
   */
  readonly next?: {
    readonly revalidate?: number | boolean;
    readonly tags?: string[];
    [key: string]: unknown;
  };
}
