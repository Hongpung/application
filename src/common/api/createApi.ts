import { useCallback, useEffect, useState } from "react";
import { useAtom, useSetAtom, WritableAtom } from "jotai";
import { getToken } from "../lib/TokenHandler";
import { StackActions, useNavigation } from "@react-navigation/native";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiConfig {
  baseUrl: string;
}

interface RequestOptions {
  url: string;
  method: RequestMethod;
  body?: any;
  params?: Record<string, string | number | string[] | number[]>;
  withAuthorize?: boolean;
  options?: FetchOptions;
}

type FetchParams<R> = {
  url: string;
  withAuthorize?: boolean;
  params?: Record<string, string | number | string[] | number[]>;
  transformResponse?: (data: any) => R;
  options?: FetchOptions;
};

type RequestParams<R> =
  | {
      url: string;
      withAuthorize?: boolean;
      params?: Record<string, string | number | string[] | number[]>;
      method: "DELETE";
      transformResponse?: (data: any) => R;
      options?: FetchOptions;
    }
  | {
      url: string;
      withAuthorize?: boolean;
      params?: Record<string, string | number | string[] | number[]>;
      method: Exclude<RequestMethod, "GET" | "DELETE">;
      transformResponse?: (data: any) => R;
      options?: FetchOptions;
    };

type BuildOption<R> = {
  url: string;
  withAuthorize?: boolean;
  method: RequestMethod;
  params?: Record<string, string | number | string[] | number[]>;
  transformResponse?: (data: any) => R;
  body?: Record<string, any>;
  options?: RequestInit;
};

interface FetchOptions extends RequestInit {
  timeout?: number;
}

const buildApi = async <T>({
  url,
  params,
  method,
  body,
  transformResponse,
  withAuthorize = true,
  options,
}: BuildOption<T>): Promise<T> => {
  const urlWithParams = new URL(url);

  if (params)
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === "undefined") return;
      else if (typeof value === "number" || typeof value === "string") {
        urlWithParams.searchParams.append(key, String(value));
      } else if (Array.isArray(value)) {
        value.forEach((item) =>
          urlWithParams.searchParams.append(key, String(item))
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

  if (body) fetchOptions["body"] = JSON.stringify(body);

  try {
    const response = await fetch(urlWithParams.toString(), {
      method,
      ...fetchOptions,
    });

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    if (response.status === 403) {
      if (withAuthorize) {
        throw new Error("Unauthorized");
      } else {
        throw new Error("Forbidden");
      }
    }
    if (!response.ok) {
      throw new Error("Errored");
    }
    const data = await response.json();

    return transformResponse ? transformResponse(data) : (data as T);
  } catch (err) {
    throw err;
  }
};

const useRequest = <T, P>() => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const navigation = useNavigation();
  const request = async ({
    options,
    transformResponse,
    body,
    ...requestParams
  }: RequestParams<T> & { body: P }) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(
      () => controller.abort(),
      options?.timeout ? options.timeout : 5000
    );
    try {
      setError(null);
      setLoading(true);

      const result = await buildApi<T>({
        options: { ...options, signal },
        ...requestParams,
        body: body ?? undefined,
      });

      setError(null); // 요청 성공 시 에러 상태 초기화

      return transformResponse ? transformResponse(result) : result;
    } catch (err) {
      setError(err as Error);
      if (
        err instanceof Error &&
        err.message === "Unauthorized" &&
        requestParams.withAuthorize
      ) {
        navigation.setOptions({ animation: "none" });
        navigation.dispatch(StackActions.replace("LoginStack"));
      }
      throw err;
    } finally {
      setLoading(false);
      clearTimeout(timeoutId);
    }
  };

  return { isLoading, error, request };
};

const useRequestWithRecoil = <T, P>({
  stateKey,
}: {
  stateKey: WritableAtom<T | null, [T | null], void>;
}) => {
  const navigation = useNavigation();
  const setData = useSetAtom(stateKey);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const request = useCallback(
    async ({
      options,
      transformResponse,
      body,
      ...requestParams
    }: RequestParams<T> & { body: P }) => {
      const controller = new AbortController();
      const signal = controller.signal;
      const timeoutId = setTimeout(
        () => controller.abort(),
        options?.timeout ? options.timeout : 5000
      );
      try {
        setLoading(true);
        const result = await buildApi<T>({
          options: { ...options, signal },
          ...requestParams,
          body: body ?? undefined,
        });
        setData(result);
        setError(null); // 요청 성공 시 에러 상태 초기화

        return transformResponse ? transformResponse(result) : result;
      } catch (err) {
        setError(err as Error);
        setData(null); // 요청 실패 시 데이터 초기화
        if (
          err instanceof Error &&
          err.message === "Unauthorized" &&
          requestParams.withAuthorize
        ) {
          navigation.setOptions({ animation: "none" });
          navigation.dispatch(StackActions.replace("LoginStack"));
        }
        throw err;
      } finally {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    },
    [stateKey]
  );

  return { isLoading, error, request };
};

const useFetch = <T>({
  url,
  params,
  transformResponse,
  options,
  withAuthorize = true,
}: FetchParams<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigation = useNavigation();

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(
      () => controller.abort(),
      options?.timeout ? options.timeout : 5000
    );

    try {
      setLoading(true);
      const result = await buildApi<T>({
        url,
        params,
        method: "GET",
        options: { ...options, signal },
      });
      setData(transformResponse ? transformResponse(result) : result);
      setError(null);
    } catch (err) {
      setError(err as Error);
      if (
        err instanceof Error &&
        err.message === "Unauthorized" &&
        withAuthorize
      ) {
        navigation.setOptions({ animation: "none" });
        navigation.dispatch(StackActions.replace("LoginStack"));
      }
      throw err;
    } finally {
      setLoading(false);
      clearTimeout(timeoutId);
    }
  }, [url, JSON.stringify(params), transformResponse]);

  useEffect(() => {
    fetchData(); // 최초 mount 시 실행
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

// useFetch 커스텀 훅 (useEffect를 통한 데이터 로딩 처리)
const useFetchWithRecoil = <T>({
  url,
  params,
  transformResponse,
  options,
  stateKey,
  withAuthorize = true,
}: FetchParams<T> & {
  stateKey: WritableAtom<T | null, [T | null], void>;
}) => {
  const [data, setData] = useAtom(stateKey);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigation = useNavigation();

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(
      () => controller.abort(),
      options?.timeout ? options.timeout : 5000
    );
    try {
      setLoading(true);
      const result = await buildApi<T>({
        url,
        params,
        method: "GET",
        options: { ...options, signal },
      });
      setData(transformResponse ? transformResponse(result) : result);
    } catch (err) {
      setError(err as Error);
      if (
        err instanceof Error &&
        err.message === "Unauthorized" &&
        withAuthorize
      ) {
        navigation.setOptions({ animation: "none" });
        navigation.dispatch(StackActions.replace("LoginStack"));
      }
      throw err;
    } finally {
      setLoading(false);
      clearTimeout(timeoutId);
    }
  }, [url, JSON.stringify(params), transformResponse, stateKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // url과 params가 변경되면 다시 실행

  return { data, isLoading, error, refetch: fetchData };
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
/** 메인 타입, 커플 타입 순 */

type Validate<T> = IsAny<T> extends true ? never : T;

type RequestReturn<Response, Params> = {
  isLoading: boolean;
  error: Error | null;
  request: (params: Validate<Params>) => Promise<Validate<Response>>;
};

type Build = {
  fetch: <Response, Params>(config: {
    // R, P에 any 비허용
    stateKey?: WritableAtom<
      Validate<Response> | null,
      [Validate<Response> | null],
      void
    >;
    query: (params: Validate<Params>) => Omit<RequestOptions, "method">;
    transformResponse?: (data: any) => Validate<Response>;
  }) => {
    type: "fetch";
    Fn: (
      params: Validate<Params>
    ) => ReturnType<typeof useFetch<Validate<Response>>>;
  };

  request: <Response, Params>(config: {
    stateKey?: WritableAtom<
      Validate<Response> | null,
      [Validate<Response> | null],
      void
    >;
    query: (params: Validate<Params>) => Omit<RequestOptions, "method"> & {
      method: Exclude<RequestMethod, "GET">;
    };
    transformResponse?: (data: unknown) => Validate<Response>;
  }) => {
    type: "request";
    Fn: () => RequestReturn<Response, Params>;
  };
};

type Endpoints = Record<
  string,

    | { type: "request"; Fn: () => RequestReturn<any, any> }
    | {
        type: "fetch";
        Fn: (params: any) => ReturnType<typeof useFetch<any>>;
      } extends
    | { type: "request"; Fn: () => infer Ret }
    | { type: "fetch"; Fn: (params: infer P) => infer Ret }
    ? Ret extends RequestReturn<infer R, infer P>
      ? { type: "request"; Fn: () => RequestReturn<R, P> }
      : Ret extends ReturnType<typeof useFetch<infer R>>
      ? { type: "fetch"; Fn: (params: P) => ReturnType<typeof useFetch<R>> }
      : never
    : never
>;

type RenameEndpoints<T extends Record<string, any>> = {
  [K in keyof T & string]: T[K] extends {
    type: "request";
    Fn: () => RequestReturn<infer R, infer P>;
  }
    ? { key: `use${Capitalize<K>}Request`; params: P; response: R }
    : T[K] extends {
        type: "fetch";
        Fn: (params: infer P) => ReturnType<typeof useFetch<infer R>>;
      }
    ? { key: `use${Capitalize<K>}Fetch`; params: P; response: R }
    : never;
};
type RenameEndpointsMap<T extends Record<string, any>> = {
  [K in RenameEndpoints<T>[keyof RenameEndpoints<T>] as K["key"]]: K["key"] extends `use${infer Name}Fetch`
    ? (params: K["params"]) => ReturnType<typeof useFetch<K["response"]>>
    : K["key"] extends `use${infer Name}Request`
    ? () => RequestReturn<K["response"], K["params"]>
    : never;
};

type addEndpointsFnParams<T> = {
  endpoints: (build: Build) => T;
};

export const createBaseApi = ({ baseUrl }: ApiConfig) => {
  const build = (): Build => {
    return {
      fetch: <R, P>({
        stateKey,
        query,
        transformResponse,
      }: {
        stateKey?: WritableAtom<
          Validate<R> | null,
          [Validate<R> | null],
          void
        >;
        query: (params: Validate<P>) => Omit<RequestOptions, "method">;
        transformResponse?: (data: any) => Validate<R>;
      }) => {
        return {
          type: "fetch",
          Fn: (params: Validate<P>) => {
            const { url, params: queryParams } = query(params);
            const finalUrl = `${baseUrl}${url}`;
            if (stateKey) {
              return useFetchWithRecoil<Validate<R>>({
                params: queryParams,
                url: finalUrl,
                transformResponse,
                stateKey,
              });
            } else {
              return useFetch<Validate<R>>({
                params: queryParams,
                url: finalUrl,
                transformResponse,
              });
            }
          },
        };
      },

      request: <R, P>({
        stateKey,
        query,
        transformResponse,
      }: {
        stateKey?: WritableAtom<
          Validate<R> | null,
          [Validate<R> | null],
          void
        >;
        query: (params: Validate<P>) => Omit<RequestOptions, "method"> & {
          method: Exclude<RequestMethod, "GET">;
        };
        transformResponse?: (data: any) => Validate<R>;
      }) => {
        return {
          type: "request",
          Fn: () => {
            const { isLoading, error, request } = stateKey
              ? useRequestWithRecoil<Validate<R>, Validate<P>>({ stateKey })
              : useRequest<Validate<R>, Validate<P>>();

            const executeRequest = async (data: Validate<P>) => {
              const { url, ...queryParams } = query(data);
              const finalUrl = `${baseUrl}${url}`;
              return request({
                ...queryParams,
                url: finalUrl,
                body: data,
                transformResponse,
              });
            };

            return { isLoading, error, request: executeRequest };
          },
        };
      },
    };
  };

  return {
    addEndpoints: <T extends Endpoints>({
      endpoints: endpointsBuilder,
    }: addEndpointsFnParams<T>) => {
      const builtEndpoints = endpointsBuilder(build());
      const namedEndpoints = {} as { [key: string]: any };

      for (const key in builtEndpoints) {
        if (Object.prototype.hasOwnProperty.call(builtEndpoints, key)) {
          const endpoint = builtEndpoints[key];
          const capitalizedKey = capitalize(key);

          const hookName =
            endpoint.type === "request"
              ? `use${capitalizedKey}Request`
              : `use${capitalizedKey}Fetch`;

          namedEndpoints[hookName] = endpoint.Fn;
        }
      }

      return namedEndpoints as RenameEndpointsMap<T>;
    },
  };
};
