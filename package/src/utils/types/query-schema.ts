import { z } from "zod";

/**
 * Schema for optional caching behavior.
 * Includes support for Next.js `revalidate` and `tags`.
 */
export const CachePropsSchema = z.object({
  tags: z.array(z.string()).optional(),
  revalidate: z.number().optional(),
});

/**
 * Schema for API query props sent from client/server to stream/fetch endpoints.
 */
export const ApiQueryPropsSchema = z.object({
  /**
   * The URL to fetch from.
   */
  queryUrl: z.string(),

  /**
   * Standard fetch options (headers, method, body, etc.).
   */
  queryOptions: z.any().optional(),

  /**
   * Caching behavior: `false`, `"swr"`, or detailed `tags`/`revalidate` config.
   */
  queryCache: z.union([z.boolean(), z.literal("swr"), CachePropsSchema]).optional(),
});

/**
 * Inferred TypeScript type from `ApiQueryPropsSchema`.
 */
export type ApiQueryProps = z.infer<typeof ApiQueryPropsSchema>;
