import { fetchHandler } from "./handlers/fetch-handler";
import { ClientQueryRequest } from "../../../utils/types/client-query";

/**
 * Props used for client-side query requests.
 * Re-exports `ApiQueryProps` for consistency with server and stream handlers.
 */
export type ClientQueryProps<T> = ClientQueryRequest<T>;

/**
 * Executes a client-side query based on caching strategy.
 *
 * @param queryProps - The query configuration including URL, options, and caching behavior.
 * @returns A Promise resolving to the query result (stream or fetch-based).
 */
export function clientQuery<T>(queryProps: ClientQueryProps<T>) {
  return fetchHandler(queryProps);
}
