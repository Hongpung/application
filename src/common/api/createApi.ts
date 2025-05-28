import {
  ApiConfig,
  FetchConfig,
  SuspenseFetchConfig,
  RequestConfig,
  FetchReturn,
  SuspenseFetchReturn,
  RequestReturn,
  Validate,
} from "./type";
import { useFetch, useSuspenseFetch, useRequest } from "./hookBuilders";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
/** 메인 타입, 커플 타입 순 */

// 🟢 any 타입 체크용 유틸리티 타입

type Build = {
  fetch: <Response, Params>(
    config: FetchConfig<Response, Params>,
  ) => {
    type: "fetch";
    Fn: (params: Validate<Params>) => FetchReturn<Response>;
  };

  suspenseFetch: <Response, Params>(
    config: SuspenseFetchConfig<Response, Params>,
  ) => {
    type: "suspenseFetch";
    Fn: (params: Validate<Params>) => SuspenseFetchReturn<Response>;
  };

  request: <Response, Params>(
    config: RequestConfig<Response, Params>,
  ) => {
    type: "request";
    Fn: () => RequestReturn<Response, Params>;
  };
};

type FetchEndpoint = {
  type: "fetch";
  Fn: (params: any) => FetchReturn<any>;
};

type RequestEndpoint = {
  type: "request";
  Fn: () => RequestReturn<any, any>;
};

type SuspenseFetchEndpoint = {
  type: "suspenseFetch";
  Fn: (params: any) => SuspenseFetchReturn<any>;
};

type BaseEndpoint = FetchEndpoint | SuspenseFetchEndpoint | RequestEndpoint;

type Endpoints = Record<string, BaseEndpoint>;

type CreateHookName<
  K extends string,
  Type extends "fetch" | "request" | "suspenseFetch",
> = Type extends "fetch"
  ? `use${Capitalize<K>}Fetch`
  : Type extends "request"
    ? `use${Capitalize<K>}Request`
    : `use${Capitalize<K>}SuspenseFetch`;

type ApiHooks<T extends Endpoints> = {
  [K in keyof T as CreateHookName<K & string, T[K]["type"]>]: T[K]["Fn"];
};

type addEndpointsFnParams<T extends Endpoints> = {
  endpoints: (build: Build) => T;
};

export const createBaseApi = ({ baseUrl }: ApiConfig) => {
  const build = (): Build => {
    return {
      fetch: <Response, Params>(config: FetchConfig<Response, Params>) => {
        return {
          type: "fetch",
          Fn: (params: Validate<Params>) =>
            useFetch<Response>({
              ...config.query(params),
              url: `${baseUrl}${config.query(params).url}`,
              ...config,
              queryOptions: config.queryOptions(params),
            }),
        };
      },

      suspenseFetch: <Response, Params>(
        config: SuspenseFetchConfig<Response, Params>,
      ) => {
        return {
          type: "suspenseFetch",
          Fn: (params: Validate<Params>) =>
            useSuspenseFetch<Response>({
              ...config.query(params),
              url: `${baseUrl}${config.query(params).url}`,
              ...config,
              queryOptions: config.queryOptions(params),
            }),
        };
      },

      request: <Response, Params>(config: RequestConfig<Response, Params>) => {
        return {
          type: "request",
          Fn: () => {
            const { mutateAsync, isPending, ...result } = useRequest<
              Response,
              Params
            >({
              queryBuilder: (params: Params) => ({
                ...config.query(params),
                url: `${baseUrl}${config.query(params).url}`,
                transformResponse: config.transformResponse,
              }),
              ...config,
            });

            const request = (params: Params) => mutateAsync(params);

            return {
              ...result,
              isLoading: isPending,
              request,
            };
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
              : endpoint.type === "suspenseFetch"
                ? `use${capitalizedKey}SuspenseFetch`
                : `use${capitalizedKey}Fetch`;

          namedEndpoints[hookName] = endpoint.Fn;
        }
      }

      return namedEndpoints as ApiHooks<T>;
    },
  };
};
