import { ServerQueryProps } from "../lib/query-handlers/server-query/server-query";
import { DEFAULTS } from "./defaults";
import { ApiQueryProps } from "./types/query-schema";
import { RequestOptions } from "./types/request";

type QueryProps = ApiQueryProps | ServerQueryProps;

/**
 * Converts a normalized query config into a valid `fetch` `RequestInit` object
 * including Next.js-specific options for caching and tagging.
 *
 * @param queryProps - The query config with URL, options, and caching strategy.
 * @returns A complete `RequestOptions` object.
 */
export const parseRequestOptions = (queryProps: QueryProps): RequestOptions => {
  const { queryOptions } = queryProps;

  return {
    ...queryOptions,
    cache: parseCacheValue(queryProps),
    next: parseNextOptions(queryProps),
  };
};

/**
 * Determines the appropriate `RequestCache` value based on `queryCache`.
 */
const parseCacheValue = (queryProps: QueryProps): RequestCache | undefined => {
  const { queryCache } = queryProps;
  const defaultCache = "force-cache";

  if (typeof queryCache === "undefined") {
    return "no-store";
  }

  if (typeof queryCache === "boolean") {
    return queryCache ? defaultCache : "no-store";
  }

  if (typeof queryCache === "object") {
    return defaultCache;
  }

  return defaultCache;
};

/**
 * Builds the `next` field for fetch, including revalidate and tags.
 */
const parseNextOptions = (queryProps: QueryProps): Record<string, unknown> | undefined => {
  const { queryUrl, queryCache } = queryProps;

  const defaultOptions = {
    revalidate: DEFAULTS.REVALIDATE,
    tags: DEFAULTS.tags(queryUrl),
  };

  if (typeof queryCache === "undefined") {
    return {};
  }

  if (typeof queryCache === "boolean") {
    return queryCache ? defaultOptions : {};
  }

  if (typeof queryCache === "object") {
    return {
      ...defaultOptions,
      ...queryCache,
    };
  }

  return defaultOptions;
};
