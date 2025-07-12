import { useRef } from "react";
import { ClientQueryProps } from "../client-query";
import { ClientQueryResponse } from "../../../../utils/types/client-query";
import { StreamSubscriber } from "../../../../utils/stream/stream-subscriber";
import { HandlerProps, syncStore } from "./sync-store/sync-store";

/**
 * Stream-based handler for `syncStore`, supporting stale-while-revalidate logic.
 *
 * @param props - Contains query props, state updater, and lifecycle controls.
 */
const handler = <T>({ queryProps, setState, notify, subscriberRef, swr }: HandlerProps<T>): void => {
  let chunkCount = 0;

  const onData = (chunk: T) => {
    chunkCount++;
    setState((prev) => ({
      ...prev,
      data: chunk,
      isLoading: chunkCount === 1,
      isCacheLoading: false,
      isFreshLoading: chunkCount === 1,
    }));
    notify();
  };

  const onError = (err: Error) => {
    setState((prev) => ({
      ...prev,
      data: null as T,
      error: err,
      isLoading: false,
      isCacheLoading: false,
      isFreshLoading: false,
    }));
    notify();
  };

  const onComplete = () => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
      isCacheLoading: false,
      isFreshLoading: false,
    }));
    notify();
  };

  if (!subscriberRef?.current) {
    const subscriber = new StreamSubscriber({
      queryProps,
      swr: swr ?? false,
      onData,
      onError,
      onComplete,
    });

    subscriberRef!.current = subscriber;
    subscriber.start().catch(onError);
  }
};

/**
 * React hook for streaming NDJSON data using `StreamSubscriber` and `useSyncExternalStore`.
 *
 * @param queryProps - Query configuration for the request.
 * @param swr - Whether to use stale-while-revalidate mode.
 * @returns Query state including data, error, and loading flags.
 */
export const streamHandler = <T>(queryProps: ClientQueryProps<T>, swr: boolean): ClientQueryResponse<T> => {
  const subscriberRef = useRef<StreamSubscriber | null>(null);
  return syncStore(handler)(queryProps, subscriberRef, swr);
};
