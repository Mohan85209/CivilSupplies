/**
 * Central fetcher for the FastAPI backend.
 *
 * Reads NEXT_PUBLIC_API_URL. Handles JSON and FormData payloads.
 * Throws ApiError on non-2xx so callers can `try/catch` and show toasts.
 */

export class ApiError extends Error {
  status: number;
  detail: unknown;
  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type FetcherInit = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
};

export async function fetcher<T = unknown>(
  path: string,
  init: FetcherInit = {}
): Promise<T> {
  const { body, token, headers, ...rest } = init;

  const finalHeaders = new Headers(headers);
  let finalBody: BodyInit | undefined;

  if (body instanceof FormData) {
    finalBody = body;
    // Do NOT set Content-Type; the browser will add the multipart boundary.
  } else if (body !== undefined) {
    finalBody = JSON.stringify(body);
    if (!finalHeaders.has("Content-Type")) {
      finalHeaders.set("Content-Type", "application/json");
    }
  }

  if (token) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const res = await fetch(url, { ...rest, headers: finalHeaders, body: finalBody });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message =
      (isJson && data && typeof data === "object" && "detail" in data
        ? typeof (data as { detail: unknown }).detail === "string"
          ? ((data as { detail: string }).detail)
          : JSON.stringify((data as { detail: unknown }).detail)
        : null) || res.statusText || "Request failed";
    throw new ApiError(res.status, message, data);
  }

  return data as T;
}
