import { useState, useEffect, useCallback } from "react";
import { Alert } from "@hongpung/src/common";
import { useSearchInvitePossibleMembersFetch } from "@hongpung/src/entities/reservation";
import { Member } from "@hongpung/src/entities/member";
import { useNavigation } from "@react-navigation/native";
import { throttle } from "lodash";

type FindOptions = {
  clubId: number[];
  keyword: string;
};

export const useInvitePossibleMemberData = (searchParams: FindOptions) => {
  const navigation = useNavigation();

  const [data, setData] = useState<Member[]>([]);
  const [page, setPage] = useState(0);
  const [isLast, setIsLast] = useState(false);

  const {
    isLoading,
    error,
    data: fetchData,
  } = useSearchInvitePossibleMembersFetch({ page, ...searchParams });

  useEffect(() => {
    if (fetchData) {
      if (page === 0) {
        setData(fetchData);
      } else {
        setData((prev) => [...prev, ...fetchData]);
      }
      if (fetchData.length < 10) {
        setIsLast(true);
      }
      // setPage(prev => prev + 1)
    } else if (error) {
      Alert.alert("오류", "오류가 발생했어요.\n다시 시도해주세요.", {
        onConfirm: () => {
          const isCanGoBack = navigation.canGoBack();
          if (isCanGoBack) {
            navigation.goBack();
          }
        }
      });

    }
  }, [fetchData]);

  useEffect(() => {
    setPage(0);
  }, [searchParams]);

  const loadNewPage = useCallback(
    throttle(() => {
      if (isLast) {
        return;
      }

      if (!isLoading) {
        setPage((prev) => prev + 1);
      }
    }, 1000),
    [setPage, isLoading]
  );

  return { data, isLoading, error, loadNewPage };
};
