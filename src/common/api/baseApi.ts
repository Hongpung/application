import { useEffect, useState } from "react";

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiConfig {
    baseUrl: string;
}

interface RequestOptions {
    url: string;
    method: RequestMethod
    body?: any;
    params?: Record<string, string | number>;
    withAuthorize?: boolean,
    options?: FetchOptions
}


type FetchParams<R> = { url: string, withAuthorize?: boolean, params?: Record<string, string | number>, transformResponse?: (data: any) => R, options?: FetchOptions }


type RequestParams<R> =
    | { url: string, withAuthorize?: boolean, params?: Record<string, string | number>, method: 'DELETE', transformResponse?: (data: any) => R, body?: never, options?: FetchOptions } |
    { url: string, withAuthorize?: boolean, params?: Record<string, string | number>, method: Exclude<RequestMethod, "GET" | "DELETE">, transformResponse?: (data: any) => R, body: Record<string, any>, options?: FetchOptions }


type BuildOption<R> = { url: string, withAuthorize?: boolean, method: RequestMethod, params?: Record<string, string | number>, transformResponse?: (data: any) => R, body?: Record<string, any>, options?: RequestInit }

interface FetchOptions extends RequestInit {
    timeout?: number;
}


const buildApi = async <T>({ url, params, method, body, transformResponse, withAuthorize, options }: BuildOption<T>): Promise<T> => {

    const urlWithParams = new URL(url);
    if (params)
        Object.keys(params).forEach((key) => urlWithParams.searchParams.append(key, String(params[key])));

    const fetchOptions: RequestInit = { headers: { 'Content-Type': 'application/json' } }

    if (options) fetchOptions['headers'] = { ...fetchOptions.headers, ...options.headers }

    if (body) fetchOptions['body'] = JSON.stringify(body)

    const response = await fetch(urlWithParams.toString(), {
        method,
        ...fetchOptions
    });

    const data = await response.json();
    return transformResponse ? transformResponse(data) : (data as T);

};



const useRequest = <T>({ options, ...requestParams }: RequestParams<T>) => {

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const request = async () => {
        const controller = new AbortController();
        const signal = controller.signal;
        const timeoutId = setTimeout(() => controller.abort(), options?.timeout ? options.timeout : 5000);
        try {
            setLoading(true);
            const result = await buildApi<T>({options,...requestParams});
            setData(result);
            setError(null); // 요청 성공 시 에러 상태 초기화
        } catch (err) {
            setError(err as Error);
            setData(null); // 요청 실패 시 데이터 초기화
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, request };
};
// useFetch 커스텀 훅 (useEffect를 통한 데이터 로딩 처리)
const useFetch = <T>({ url, params, transformResponse, options }: FetchParams<T>) => {

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);


    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                setLoading(true);
                const result = await buildApi<T>({ url, params, method: 'GET', options });
                setData(transformResponse ? transformResponse(result) : result);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchDataAsync();

    }, [url, params, transformResponse]); // url과 params가 변경되면 다시 실행

    return { data, loading, error };
};


const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);



// baseApi를 함수형으로 구현
export const createBaseApi = ({ baseUrl }: ApiConfig) => {

    type Build = {
        query: <R, P>(config: {
            query: (params: P) => Omit<RequestOptions, 'method'>;
            transformResponse?: (data: any) => R;
        }) => (params: P) => ReturnType<typeof useFetch<R>>;
        request: <R, P>(config: {
            query: (params: P) => Omit<RequestOptions, 'method'> & { method: Exclude<RequestMethod, "GET"> }
            transformResponse?: (data: any) => R;
        }) => (params: P) => ReturnType<typeof useRequest<R>>;
    }


    const build = (): Build => {
        return {
            query: <R, P>({
                query,
                transformResponse,
            }: {
                query: (params: P) => Omit<RequestOptions, "method">;
                transformResponse?: (data: any) => R;
            }) => {
                return (params: P) => {
                    const { url, params: queryParams } = query(params);
                    const finalUrl = `${baseUrl}${url}`;
                    return useFetch<R>({ ...queryParams, url: finalUrl, transformResponse });
                }
            },

            request: <R, P>({
                query,
                transformResponse,
            }: {
                query: (params: P) => Omit<RequestOptions, "method"> & { method: Exclude<RequestMethod, "GET"> }
                transformResponse?: (data: any) => R;
            }) => {
                return (params: P) => {
                    const { url, ...QueryParams } = query(params);
                    const finalUrl = `${baseUrl}${url}`;
                    return useRequest<R>({ ...QueryParams, url: finalUrl, transformResponse });
                }

            },
        };
    }

    type Endpoints = Record<string, (params: any) => (ReturnType<typeof useRequest<any>> | ReturnType<typeof useFetch<any>>)>;

    // type RenameEndpoints<T extends Endpoints> = {
    //     [K in keyof T & string]: 
    //     T[K] extends (params:any)=> ReturnType<typeof useRequest<any>> ? `use${Capitalize<K>}Request`
    //     : T[K] extends (params:any)=> ReturnType<typeof useFetch<any>> ? `use${Capitalize<K>}Fetch`
    //     : never;
    // };

    // type RenameEndpointsMap<T extends Record<string, any>> = {
    //     [K in RenameEndpoints<T>[keyof RenameEndpoints<T>] & string]: 
    //     K extends `use${infer Name}Fetch`
    //     ? (params: Parameters<T[Uncapitalize<Name>]>[0]) => ReturnType<typeof useFetch<any>>
    //     : K extends `use${infer Name}Request`
    //     ? (params: Parameters<T[Uncapitalize<Name>]>[0]) => ReturnType<typeof useRequest<any>>
    //     : never;
    // };

    type RenameEndpoints<T extends Record<string, any>> = {
        [K in keyof T & string]:
        T[K] extends (params: infer P) => ReturnType<typeof useRequest<infer R>>
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
        ? (params: K['params']) => ReturnType<typeof useRequest<K['response']>>
        : never;
    };


    // type Capitalize<T extends string> = T extends `${infer First}${string}` ? `${Uppercase<First extends infer X ? X : never>}${Lowercase<string & T>}` : '';

    // type NamedEndpoints<T extends Endpoints> = {
    //     [K in Extract<keyof T, string>] : Capitalize<K>;
    // };

    return {
        addEndpoints: <T extends Endpoints>(endpointsBuilder: (build: Build) => { endpoints: T }) => {
            const builtEndpoints = endpointsBuilder(build()).endpoints;
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
        },
    };
};

// baseApi 인스턴스 생성
export const baseApi = createBaseApi({ baseUrl: process.env.EXPO_PUBLIC_BASE_URL });

const cartApi = baseApi.addEndpoints((build) => ({
    endpoints: {
        cart: build.query<object, object>({
            query: () => ({
                url: 's',
                withAuthorize: true
            })
        })
    }
}))