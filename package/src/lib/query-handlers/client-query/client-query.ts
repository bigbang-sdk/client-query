import { streamHandler } from "./handlers/stream-handler";
import { fetchHandler } from "./handlers/fetch-handler";
import { ApiQueryProps } from "../../../utils/types/query-schema";
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
  const strategy = resolveQueryStrategy(queryProps);

  if (strategy === "client") {
    return fetchHandler(queryProps);
  } else if (strategy === "cache") {
    return streamHandler(queryProps, false);
  } else {
    return streamHandler(queryProps, true);
  }
}

/**
 * Resolves the appropriate query execution strategy.
 *
 * @param queryProps - The query configuration.
 * @returns A strategy string: `"client"`, `"cache"`, or `"swr"`.
 */
const resolveQueryStrategy = (queryProps: ClientQueryProps<any>): "client" | "swr" | "cache" => {
  const { queryCache } = queryProps;

  if (typeof queryCache === "undefined" || queryCache === false) return "client";
  if (queryCache === "swr") return "swr";

  return "cache";
};
