import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
  useSuspenseQuery,
  UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import {
  FetchParams,
  RequestParams,
  FetchReturn,
  SuspenseFetchReturn,
  Validate,
} from "./type";
import { useCallback } from "react";
import { useNavigation, StackActions } from "@react-navigation/native";
import { Alert } from "../atom/alertAtom";
import { buildApi } from "./apiBuilder";

const useFetch = <T>({
  url,
  params,
  transformResponse,
  options,
  withAuthorize = true,
  queryOptions,
}: FetchParams<T> & {
  queryOptions: Omit<UseQueryOptions<T, Error>, "queryFn">;
}): FetchReturn<T> => {
  const navigation = useNavigation();

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(
      () => controller.abort(),
      options?.timeout ? options.timeout : 5000,
    );

    try {
      const result = await buildApi<T>({
        url,
        params,
        method: "GET",
        options: { ...options, signal },
        withAuthorize,
        transformResponse,
      });

      return result;
    } catch (err) {
      if (err instanceof Error) {
        if (err.cause === "unauthorized" && withAuthorize) {
          Alert.alert("세션 만료", "다시 로그인 해주세요.");
          navigation.dispatch(StackActions.replace("LoginStack"));
        }
      }
      if ((err as Error).name === "AbortError") {
        Alert.alert(
          "인터넷 오류",
          "인터넷 연결 상태를 확인 후 시도해주세요.\n오류가 반복되면 관리자에게 문의해주세요.",
        );
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }, [url, params, transformResponse, withAuthorize, options, navigation]);

  return useQuery<T, Error>({
    queryFn: fetchData,
    ...queryOptions,
  });
};

const useSuspenseFetch = <T>({
  url,
  params,
  transformResponse,
  options,
  withAuthorize = true,
  queryOptions,
}: FetchParams<T> & {
  queryOptions: Omit<UseSuspenseQueryOptions<T, Error>, "queryFn">;
}): SuspenseFetchReturn<T> => {
  const navigation = useNavigation();

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(
      () => controller.abort(),
      options?.timeout ? options.timeout : 5000,
    );

    try {
      const result = await buildApi<T>({
        url,
        params,
        method: "GET",
        options: { ...options, signal },
        transformResponse,
      });

      return result;
    } catch (err) {
      if (
        err instanceof Error &&
        err.cause === "unauthorized" &&
        withAuthorize
      ) {
        Alert.alert("세션 만료", "다시 로그인 해주세요.");
        navigation.dispatch(StackActions.replace("LoginStack"));
      }
      if ((err as Error).name === "AbortError") {
        Alert.alert(
          "인터넷 오류",
          "인터넷 연결 상태를 확인 후 시도해주세요.\n오류가 반복되면 관리자에게 문의해주세요.",
        );
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }, [url, params, transformResponse, withAuthorize, options, navigation]);

  return useSuspenseQuery<T, Error>({
    queryFn: fetchData,
    ...queryOptions,
  });
};

const useRequest = <T, P>({
  queryBuilder,
  queryOptions,
}: {
  queryBuilder: (params: P) => RequestParams<T> & { body?: P };
  queryOptions?: Partial<Omit<UseMutationOptions<T, Error, P>, "mutationFn">>;
}): UseMutationResult<T, Error, P> => {
  const navigation = useNavigation();

  const request = async ({
    options,
    body,
    transformResponse,
    ...requestParams
  }: RequestParams<T> & { body?: P }): Promise<Validate<T>> => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(
      () => controller.abort(),
      options?.timeout ? options.timeout : 5000,
    );

    try {
      const result = await buildApi<T>({
        options: { ...options, signal },
        ...requestParams,
        body: body ?? undefined,
        transformResponse,
      });

      return result;
    } catch (err) {
      if (
        err instanceof Error &&
        err.cause === "unauthorized" &&
        requestParams.withAuthorize
      ) {
        Alert.alert("세션 만료", "다시 로그인 해주세요.");
        navigation.dispatch(StackActions.replace("LoginStack"));
      }
      if ((err as Error).name === "AbortError") {
        Alert.alert(
          "인터넷 오류",
          "인터넷 연결 상태를 확인 후 시도해주세요.\n오류가 반복되면 관리자에게 문의해주세요.",
        );
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const result = useMutation<T, Error, P>({
    mutationFn: (params: P) => request(queryBuilder(params)),
    ...queryOptions,
  });

  return { ...result };
};

export { useFetch, useSuspenseFetch, useRequest };
