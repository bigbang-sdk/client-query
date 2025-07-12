import { ZodSchema } from "zod";

/**
 * Represents the state of a client-side query using NDJSON streaming or fetch.
 */
export interface ClientQueryResponse<T> {
  /**
   * The latest parsed data chunk. May be partial if only the first chunk has arrived.
   */
  data: T | null;

  /**
   * An error encountered during streaming or fetch.
   */
  error: Error | null;

  /**
   * True until both cache and fresh data have arrived (or failed).
   */
  isLoading: boolean;

  /**
   * True until the first (cached) chunk has arrived.
   */
  isCacheLoading: boolean;

  /**
   * True until the second (fresh) chunk has arrived.
   */
  isFreshLoading: boolean;
}

export interface ClientQueryRequest<T> {
  queryUrl: string;
  queryOptions?: RequestInit;
  queryCache?: boolean | "swr" | { tags?: string[]; revalidate?: number };
  querySchema?: ZodSchema<T>;
}
