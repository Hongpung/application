import { useCallback, useEffect, useState } from "react";
import { RecoilState, useRecoilState, useSetRecoilState } from "recoil";
import { getToken } from "../lib/TokenHandler";

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiConfig {
    baseUrl: string;
}

interface RequestOptions {
    url: string;
    method: RequestMethod
    body?: any;
    params?: Record<string, string | number | string[] | number[]>;
    withAuthorize?: boolean,
    options?: FetchOptions
}

type FetchParams<R> = { url: string, withAuthorize?: boolean, params?: Record<string, string | number | string[] | number[]>, transformResponse?: (data: any) => R, options?: FetchOptions }

type RequestParams<R> =
    | { url: string, withAuthorize?: boolean, params?: Record<string, string | number | string[] | number[]>, method: 'DELETE', transformResponse?: (data: any) => R, options?: FetchOptions } |
    { url: string, withAuthorize?: boolean, params?: Record<string, string | number | string[] | number[]>, method: Exclude<RequestMethod, "GET" | "DELETE">, transformResponse?: (data: any) => R, options?: FetchOptions }

type BuildOption<R> = { url: string, withAuthorize?: boolean, method: RequestMethod, params?: Record<string, string | number | string[] | number[]>, transformResponse?: (data: any) => R, body?: Record<string, any>, options?: RequestInit }

interface FetchOptions extends RequestInit {
    timeout?: number;
}

const buildApi = async <T>({ url, params, method, body, transformResponse, withAuthorize, options }: BuildOption<T>): Promise<T> => {

    const urlWithParams = new URL(url);
    if (params)
        Object.keys(params).forEach((key) => {
            const value = params[key];
            if (typeof value === 'number' || typeof value === 'string') {
                urlWithParams.searchParams.append(key, String(value));
            } else if (Array.isArray(value)) {
                value.forEach((item) => urlWithParams.searchParams.append(key, String(item)));
            }
        });

    const fetchOptions: RequestInit = {}

    if (options) {
        if (withAuthorize) {

            const token = getToken('token')
            fetchOptions.headers = { ...fetchOptions.headers, ...options.headers, 'Authorization': `Bearer ${token}` }
        }
        else
            fetchOptions.headers = { ...fetchOptions.headers, ...options.headers }
    }

    if (body) fetchOptions['body'] = JSON.stringify(body)

    const response = await fetch(urlWithParams.toString(), {
        method,
        ...fetchOptions
    });

    const data = await response.json();
    return transformResponse ? transformResponse(data) : (data as T);

};


const useRequest = <T, P>() => {

    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const request = useCallback(async ({ options, transformResponse, body, ...requestParams }: RequestParams<T> & { body: P }) => {
        const controller = new AbortController();
        const signal = controller.signal;
        const timeoutId = setTimeout(() => controller.abort(), options?.timeout ? options.timeout : 5000);
        try {
            setLoading(true);
            const result = await buildApi<T>({ options: { ...options, signal }, ...requestParams, body: body ?? undefined });

            setError(null); // 요청 성공 시 에러 상태 초기화

            return transformResponse ? transformResponse(result) : result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
            clearTimeout(timeoutId)
        }
    }, []);

    return { isLoading, error, request };
};

const useRequestWithRecoil = <T, P>({ recoilState }: { recoilState: RecoilState<T | null> }) => {

    const setData = useSetRecoilState<T | null>(recoilState);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const request = useCallback(async ({ options, transformResponse, body, ...requestParams }: RequestParams<T> & { body: P }) => {
        const controller = new AbortController();
        const signal = controller.signal;
        const timeoutId = setTimeout(() => controller.abort(), options?.timeout ? options.timeout : 5000);
        try {
            setLoading(true);
            const result = await buildApi<T>({ options: { ...options, signal }, ...requestParams, body: body ?? undefined });
            setData(result);
            setError(null); // 요청 성공 시 에러 상태 초기화

            return transformResponse ? transformResponse(result) : result;
        } catch (err) {
            setError(err as Error);
            setData(null); // 요청 실패 시 데이터 초기화
            throw err;
        } finally {
            setLoading(false);
            clearTimeout(timeoutId)
        }
    }, [recoilState]);

    return { isLoading, error, request };
};



// useFetch 커스텀 훅 (useEffect를 통한 데이터 로딩 처리)
const useFetch = <T>({ url, params, transformResponse, options }: FetchParams<T>) => {

    const [data, setData] = useState<T | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);


    useEffect(() => {
        const fetchDataAsync = async () => {

            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), options?.timeout ? options.timeout : 5000);

            try {
                setLoading(true);
                const result = await buildApi<T>({ url, params, method: 'GET', options: { ...options, signal }, });
                setData(transformResponse ? transformResponse(result) : result);
            } catch (err) {
                setError(err as Error);
                throw err;
            } finally {
                setLoading(false);
                clearTimeout(timeoutId)
            }
        };

        fetchDataAsync();

    }, [url, params, transformResponse]); // url과 params가 변경되면 다시 실행

    return { data, isLoading, error };
};

// useFetch 커스텀 훅 (useEffect를 통한 데이터 로딩 처리)
const useFetchWithRecoil = <T>({ url, params, transformResponse, options, recoilState }: FetchParams<T> & { recoilState: RecoilState<T | null> }) => {

    const [data, setData] = useRecoilState<T | null>(recoilState);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchDataAsync = async () => {
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), options?.timeout ? options.timeout : 5000);
            try {
                setLoading(true);
                const result = await buildApi<T>({ url, params, method: 'GET', options: { ...options, signal } });
                setData(transformResponse ? transformResponse(result) : result);
            } catch (err) {

                setError(err as Error);
                throw err;

            } finally {

                setLoading(false);
                clearTimeout(timeoutId)

            }
        };

        fetchDataAsync();

    }, [url, params, transformResponse]); // url과 params가 변경되면 다시 실행

    return { data, isLoading, error };
};


const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
/** 메인 타입, 커플 타입 순 */
type ValidateGeneric<R, P> = IsAny<P> extends true ? never : IsAny<R> extends true ? never : R
type Validate<T> = IsAny<T> extends true ? never : T;

type RequestReturn<Response, Params> = {
    isLoading: boolean;
    error: Error | null;
    request: (params: Validate<Params>) => Promise<Validate<Response>>;
}

type Build = {

    fetch: <Response, Params>( // R, P에 any 비허용
        config: {
            recoilState?: RecoilState<Validate<Response> | null>,
            query: (params: Validate<Params>) => Omit<RequestOptions, 'method'>;
            transformResponse?: (data: any) => Validate<Response>;
        }
    ) => (params: Validate<Params>)
            => ReturnType<typeof useFetch<Validate<Response>>>,

    request: <Response, Params>(
        config: {
            recoilState?: RecoilState<Validate<Response> | null>;
            query: (params: Validate<Params>) => Omit<RequestOptions, "method"> & { method: Exclude<RequestMethod, "GET"> };
            transformResponse?: (data: unknown) => Validate<Response>;
        }
    ) => () => RequestReturn<Response, Params>;
}

type Endpoints = Record<string, ((() => RequestReturn<any, any>)) extends (() => infer Ret) ?
    Ret extends RequestReturn<infer R, infer P> ?
    (() => (RequestReturn<R, P>))
    :
    never
    :
    Record<string, (params: any) => ReturnType<typeof useFetch<any>>> extends ((params: infer P) => infer Ret) ?
    Ret extends ReturnType<typeof useFetch<infer R>> ?
    ((params: P) => (ReturnType<typeof useFetch<R>>))
    :
    never
    :
    never
>;


type RenameEndpoints<T extends Record<string, any>> = {
    [K in keyof T & string]:
    T[K] extends () => RequestReturn<infer R, infer P>
    ? { key: `use${Capitalize<K>}Request`, params: P, response: R }
    : T[K] extends (params: infer P) => ReturnType<typeof useFetch<infer R>>
    ? { key: `use${Capitalize<K>}Fetch`, params: P, response: R }
    : never;
};
type RenameEndpointsMap<T extends Record<string, any>> = {
    [K in RenameEndpoints<T>[keyof RenameEndpoints<T>]as K['key']]:
    K['key'] extends `use${infer Name}Fetch`
    ? (params: K['params']) => ReturnType<typeof useFetch<K['response']>>
    : K['key'] extends `use${infer Name}Request`
    ? () => RequestReturn<K['response'], K['params']>
    : never;
};

type addEndpointsFnParams<T> = {
    endpoints: (build: Build) => T
};

export const createBaseApi = ({ baseUrl }: ApiConfig) => {

    const build = (): Build => {
        return {
            fetch: <R, P>({
                recoilState,
                query,
                transformResponse,
            }: {
                recoilState?: RecoilState<Validate<R> | null>,
                query: (params: Validate<P>) => Omit<RequestOptions, 'method'>;
                transformResponse?: (data: any) => Validate<R>
            }) => {
                return (params: Validate<P>) => {
                    const { url, params: queryParams } = query(params);
                    const finalUrl = `${baseUrl}${url}`;
                    if (recoilState)
                        return useFetchWithRecoil<Validate<R>>({ ...queryParams, url: finalUrl, transformResponse, recoilState });
                    else
                        return useFetch<Validate<R>>({ ...queryParams, url: finalUrl, transformResponse });
                }
            },

            request: <R, P>({
                recoilState,
                query,
                transformResponse,
            }: {
                recoilState?: RecoilState<Validate<R> | null>,
                query: (params: Validate<P>) => Omit<RequestOptions, "method"> & { method: Exclude<RequestMethod, "GET"> }
                transformResponse?: (data: any) => Validate<R>;
            }) => {
                return () => { // ✅ 이제 훅 호출 시 userParams를 받지 않음
                    const { isLoading, error, request } = recoilState
                        ? useRequestWithRecoil<Validate<R>, Validate<P>>({ recoilState })
                        : useRequest<Validate<R>, Validate<P>>();

                    const executeRequest = async (params: Validate<P>) => { // ✅ params는 여기서 받음
                        const { url, ...queryParams } = query(params);
                        return request({ ...queryParams, url: `${baseUrl}${url}`, body: params, transformResponse });
                    };

                    return { isLoading, error, request: executeRequest };
                };
            },
        };
    }

    return {
        addEndpoints: <T extends Endpoints>({ endpoints: endpointsBuilder }: addEndpointsFnParams<T>) => {
            const builtEndpoints = endpointsBuilder(build());
            const namedEndpoints = {} as { [key: string]: any };

            for (const key in builtEndpoints) {
                if (Object.prototype.hasOwnProperty.call(builtEndpoints, key)) {
                    const endpoint = builtEndpoints[key];
                    const capitalizedKey = capitalize(key);
                    const hookName = 'request' in endpoint ? `use${capitalizedKey}Request` : `use${capitalizedKey}Fetch`;
                    namedEndpoints[hookName] = endpoint;
                }
            }

            return namedEndpoints as RenameEndpointsMap<T>;
        }
    };
};