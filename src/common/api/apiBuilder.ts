import { RequestMethod, FetchOptions, Validate } from "./type";
import { getToken } from "../lib/TokenHandler";
import { trackApiCall, trackError } from "../config/sentry.config";

type BuildOption<R> = {
  url: string;
  withAuthorize?: boolean;
  method: RequestMethod;
  params?: Record<string, string | number | string[] | number[]>;
  transformResponse?: (data: any) => Validate<R>;
  body?: Record<string, any> | FormData | File;
  options?: FetchOptions;
};

const buildApi = async <T>({
  url,
  params,
  method,
  body,
  transformResponse,
  withAuthorize = true,
  options,
}: BuildOption<T>): Promise<Validate<T>> => {
  const startTime = Date.now();
  const apiEndpoint = new URL(url).pathname;

  // API 호출 시작 추적
  const transaction = trackApiCall(apiEndpoint, method, {
    withAuthorize,
    hasBody: !!body,
    hasParams: !!params,
  });

  try {
    const urlWithParams = new URL(url);

    if (params)
      Object.entries(params).forEach(([key, value]) => {
        if (typeof value === "undefined") return;
        else if (typeof value === "number" || typeof value === "string") {
          urlWithParams.searchParams.append(key, String(value));
        } else if (Array.isArray(value)) {
          value.forEach((item) =>
            urlWithParams.searchParams.append(key, String(item)),
          );
        }
      });

    const fetchOptions: RequestInit = {};

    if (options) {
      if (withAuthorize) {
        const token = await getToken("token");
        fetchOptions.headers = {
          ...fetchOptions.headers,
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      } else
        fetchOptions.headers = { ...fetchOptions.headers, ...options.headers };
    }

    if (body !== undefined) {
      fetchOptions.body =
        body instanceof FormData || body instanceof File
          ? body
          : JSON.stringify(body);
    }

    const response = await fetch(urlWithParams.toString(), {
      method,
      ...fetchOptions,
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const data = await response.json();

      // 에러 추적
      const errorType =
        response.status === 401
          ? "unauthorized"
          : response.status === 403
            ? "forbidden"
            : "unknown";

      trackError(`API Error: ${method} ${apiEndpoint}`, {
        status: response.status,
        errorType,
        message: data.message,
        responseTime,
        url: apiEndpoint,
        method,
      });

      if (response.status === 401) {
        throw new Error(data.message, { cause: "unauthorized" });
      }
      if (response.status === 403) {
        throw new Error(data.message, { cause: "forbidden" });
      }

      throw new Error(data.message, { cause: "unknown" });
    }

    // 응답 본문이 비어있는지 확인
    const contentLength = response.headers.get("content-length");
    const contentType = response.headers.get("content-type");

    // 빈 응답이거나 JSON이 아닌 경우 처리
    if (
      contentLength === "0" ||
      (!contentType?.includes("application/json") &&
        !contentType?.includes("text/json"))
    ) {
      const data = undefined as any;

      // 성공 추적 (빈 응답)
      transaction?.setTag("response_type", "empty");
      transaction?.setTag("success", true);
      transaction?.setMeasurement("response_time", responseTime);
      transaction?.finish();

      return transformResponse ? transformResponse(data) : data;
    }

    const data = await response.json();

    // 성공 추적
    transaction?.setTag("response_type", "json");
    transaction?.setTag("success", true);
    transaction?.setMeasurement("response_time", responseTime);
    transaction?.setMeasurement("response_size", JSON.stringify(data).length);
    transaction?.finish();

    return transformResponse ? transformResponse(data) : data;
  } catch (error) {
    const responseTime = Date.now() - startTime;

    // 예외 에러 추적
    trackError(`API Exception: ${method} ${apiEndpoint}`, {
      error: error instanceof Error ? error.message : String(error),
      responseTime,
      url: apiEndpoint,
      method,
    });

    transaction?.setTag("success", false);
    transaction?.setMeasurement("response_time", responseTime);
    transaction?.finish();

    throw error;
  }
};

export { buildApi };
