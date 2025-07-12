import { HandlerProps, syncStore } from "./sync-store/sync-store";

/**
 * Handler function for fetching data via standard `fetch`,
 * used by `syncStore` to produce a stable query response.
 *
 * @param props - Contains query props, state updater, and notifier.
 */
const handler = async <T>({ queryProps, setState, notify }: HandlerProps<T>): Promise<void> => {
  try {
    let response = await fetch(queryProps.queryUrl, queryProps.queryOptions).then((res) => res.json());

    if (queryProps.querySchema) {
      response = queryProps.querySchema.parse(response) as T;
    }

    setState((prev) => ({
      ...prev,
      data: response as T,
      error: null,
      isLoading: false,
      isCacheLoading: false,
      isFreshLoading: false,
    }));
  } catch (error) {
    setState((prev) => ({
      ...prev,
      error: error as Error,
      isLoading: false,
      isCacheLoading: false,
      isFreshLoading: false,
    }));
  } finally {
    notify();
  }
};

/**
 * React hook for fetching non-streaming data using `syncStore`.
 *
 * @remarks Does not support SWR or incremental chunks.
 */
export const fetchHandler = syncStore(handler);
