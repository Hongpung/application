// hooks/useSyncQueryToAtom.ts
import { useEffect } from "react";
import { useSetAtom, WritableAtom } from "jotai";
import { UseQueryResult } from "@tanstack/react-query";

export const useSyncQueryToAtom = <T>(
  queryResult: UseQueryResult<T, Error>,
  targetAtom: WritableAtom<T | null, [T | null], void>,
) => {
  const setAtomValue = useSetAtom(targetAtom);

  useEffect(() => {
    if (queryResult.isSuccess && queryResult.data) {
      setAtomValue(queryResult.data);
    }
  }, [queryResult.isSuccess, queryResult.data, setAtomValue]);

  useEffect(() => {
    if (queryResult.error) {
      setAtomValue(null);
    }
  }, [queryResult.error, setAtomValue]);
};
