import type { CompleteResult } from "./stellar-side";

/** Maps a `completeBurn` outcome to its HTTP status and optional `Retry-After` header. */
export function completeResultResponse(result: CompleteResult): Response {
  const retryAfter = result.status === "pending" ? result.retryAfterMs : undefined;
  const status =
    result.status === "refused"
      ? 422
      : result.status === "failed"
        ? 502
        : retryAfter !== undefined
          ? 503
          : 200;
  const headers =
    retryAfter !== undefined
      ? { "Retry-After": String(Math.max(1, Math.ceil(retryAfter / 1000))) }
      : undefined;
  return Response.json(result, { status, ...(headers ? { headers } : {}) });
}
