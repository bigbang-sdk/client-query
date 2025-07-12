import { parseErrorMessage } from "../../../utils/error";
import { NDJSON } from "../../../utils/ndjson";
import { parseRequestOptions } from "../../../utils/request-options";
import { StreamProducer } from "../../../utils/stream/stream-producer";
import { ApiQueryProps, ApiQueryPropsSchema } from "../../../utils/types/query-schema";

/**
 * Handles POST requests for streaming data from an API using NDJSON.
 *
 * @param req - The incoming HTTP `Request`, must contain JSON body with `queryProps`.
 * @param revalidateTag - The Next.js `revalidateTag` function for cache invalidation.
 * @param swr - Whether to enable stale-while-revalidate behavior.
 * @returns A `Response` stream (NDJSON) or an error response.
 */
export async function streamHandler(req: Request, revalidateTag: (tag: string) => void, swr: boolean): Promise<Response> {
  try {
    const payload = await req.json().catch(() => NDJSON.errorResponse("Invalid JSON body", 400));

    if (payload instanceof Response) return payload;

    const parseResult = ApiQueryPropsSchema.safeParse(payload.queryProps);
    if (!parseResult.success) {
      return NDJSON.errorResponse("Invalid queryProps", 400);
    }

    const queryProps: ApiQueryProps = parseResult.data;
    const requestOptions = parseRequestOptions(queryProps);

    const producer = new StreamProducer(queryProps.queryUrl, requestOptions, revalidateTag, swr);
    return producer.initiateStream();
  } catch (error) {
    return NDJSON.errorResponse(parseErrorMessage(error), 500);
  }
}
