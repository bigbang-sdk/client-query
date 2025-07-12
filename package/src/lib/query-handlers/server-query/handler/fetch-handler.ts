import { parseRequestOptions } from "../../../../utils/request-options";
import { ServerQueryProps } from "../server-query";

/**
 * Performs a server-side fetch using the provided query properties.
 * Parses response as JSON and returns either the data or an error.
 *
 * @param queryProps - The URL, request options, and optional caching configuration.
 * @returns A Promise resolving to an object containing `data` or `error`.
 */
export const fetchHandler = async (queryProps: ServerQueryProps): Promise<{ data: unknown; error: Error | null }> => {
  try {
    const response = await fetch(queryProps.queryUrl, parseRequestOptions(queryProps));
    const json = await response.json();
    return { data: json, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};
