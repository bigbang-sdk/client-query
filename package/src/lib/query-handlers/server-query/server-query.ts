import { fetchHandler } from "./handler/fetch-handler";

/**
 * Optional caching behavior for the server query.
 */
export type CacheProps = {
  tags?: string[];
  revalidate?: number;
};

/**
 * Props required to perform a server-side API fetch.
 */
export type ServerQueryProps = {
  queryUrl: string;
  queryOptions?: RequestInit;
  queryCache?: boolean | CacheProps;
};

/**
 * Server-side data fetcher that wraps `fetchHandler` for typed usage.
 * Supports optional caching via `queryCache`.
 *
 * @param queryProps - The request details including URL, options, and caching behavior.
 * @returns A Promise resolving to an object with `data` or `error`.
 */
export const serverQuery = async (queryProps: ServerQueryProps): Promise<{ data: any; error: Error | null }> => {
  return fetchHandler(queryProps);
};
