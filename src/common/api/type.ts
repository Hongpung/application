import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiConfig {
  baseUrl: string;
}

interface FetchOptions extends RequestInit {
  timeout?: number;
}

interface RequestOptions {
  url: string;
  method: RequestMethod;
  body?: any;
  params?: Record<string, string | number | string[] | number[]>;
  withAuthorize?: boolean;
  options?: FetchOptions;
}

// any 타입 체크용 유틸리티 타입
type IsAny<T> = 0 extends 1 & T ? true : false;
type Validate<T> = IsAny<T> extends true ? never : T;

export type { RequestMethod, ApiConfig, FetchOptions, Validate };

type FetchParams<R> = {
  url: string;
  withAuthorize?: boolean;
  params?: Record<string, string | number | string[] | number[]>;
  transformResponse?: (data: any) => Validate<R>;
  options?: FetchOptions;
};

type RequestParams<R> =
  | {
      url: string;
      withAuthorize?: boolean;
      params?: Record<string, string | number | string[] | number[]>;
      method: "DELETE";
      transformResponse?: (data: unknown) => Validate<R>;
      options?: FetchOptions;
    }
  | {
      url: string;
      withAuthorize?: boolean;
      params?: Record<string, string | number | string[] | number[]>;
      method: Exclude<RequestMethod, "GET" | "DELETE">;
      transformResponse?: (data: unknown) => Validate<R>;
      options?: FetchOptions;
    };

export type { RequestOptions, FetchParams, RequestParams };

type FetchConfig<R, P> = {
  query: (params: Validate<P>) => Omit<RequestOptions, "method">;
  queryOptions: (
    params: Validate<P>,
  ) => Omit<UseQueryOptions<R, Error>, "queryFn">;
  transformResponse?: (data: any) => Validate<R>;
};

type SuspenseFetchConfig<R, P> = {
  query: (params: Validate<P>) => Omit<RequestOptions, "method">;
  queryOptions: (
    params: Validate<P>,
  ) => Omit<UseSuspenseQueryOptions<R, Error>, "queryFn">;
  transformResponse?: (data: any) => Validate<R>;
};

type RequestConfig<R, P> = {
  query: (params: P) => RequestParams<R>;
  queryOptions?: Omit<UseMutationOptions<R, Error, P>, "mutationFn">;
  transformResponse?: (data: any) => Validate<R>;
};

export type { FetchConfig, SuspenseFetchConfig, RequestConfig };

type FetchReturn<Response> = UseQueryResult<Response, Error>;

type SuspenseFetchReturn<Response> = UseSuspenseQueryResult<Response, Error>;

type RequestReturn<Response, Params> = Omit<
  UseMutationResult<Response, Error, Params, unknown>,
  "mutateAsync" | "isPending"
> & {
  request: (params: Params) => Promise<Response>;
  isLoading: boolean;
};

export type { FetchReturn, SuspenseFetchReturn, RequestReturn };
