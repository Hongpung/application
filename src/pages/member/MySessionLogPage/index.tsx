import React, { useRef, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  ViewToken,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
} from "react-native";

import { Header } from "@hongpung/src/common";
import MiniCalendar, {
  MiniCalendarRef,
} from "@hongpung/src/common/ui/MiniCalendar";
import { useMiniCalendar } from "@hongpung/src/common/lib/useMiniCalendar";

import { useSessionColor } from "@hongpung/src/entities/session";

import { useLoadMySessionLogFetch } from "@hongpung/src/entities/session-log/api/sessionLogApi";
import { SessionLogList } from "@hongpung/src/widgets/session-log";
import { MainStackScreenProps } from "@hongpung/src/common/navigation";
import { SessionLog } from "@hongpung/src/entities/session-log";
import dayjs from "dayjs";
import { debounce } from "lodash";

const MySessionLogPage: React.FC<MainStackScreenProps<"MyLog">> = ({
  navigation,
}) => {
  const { currentMonth, handleDateSelect, incrementMonth, decrementMonth } =
    useMiniCalendar();
  const { data: sessionLogList, isLoading: isLoadingSessionLog } =
    useLoadMySessionLogFetch({
      calendarMonth: currentMonth,
    });
  const matchedSessionList = useMemo(
    () =>
      Object.entries(sessionLogList || {}).sort((a, b) =>
        dayjs(b[0]).diff(dayjs(a[0])),
      ),
    [sessionLogList],
  );
  const dailySessionColors = useSessionColor({ sessionLogList });

  const sessionLogListRef = useRef<FlatList<[string, SessionLog[]]>>(null);
  const miniCalendarRef = useRef<MiniCalendarRef>(null);

  const handleSessionPress = (sessionId: number) => {
    navigation.navigate("SessionLogInfo", { sessionId });
  };

  // 캘린더에서 날짜 선택 시 해당 날짜로 스크롤 이동
  const handleDateSelectWithScroll = useCallback(
    (date: Date | null) => {
      if (!date) {
        miniCalendarRef.current?.focusDate(null);
        sessionLogListRef.current?.scrollToOffset({
          offset: 0,
          animated: false,
        });
        handleDateSelect(null);
        return;
      }
      handleDateSelect(date); // 기존 날짜 선택 로직 실행

      if (date && sessionLogListRef.current) {
        // 선택된 날짜에 해당하는 세션 로그 아이템의 인덱스 찾기
        const dateString = dayjs(date).format("YYYY-MM-DD");
        const targetIndex = matchedSessionList.findIndex(
          ([sessionDate]) => sessionDate === dateString,
        );

        if (targetIndex !== -1) {
          // 해당 인덱스로 스크롤 이동
          try {
            sessionLogListRef.current?.scrollToIndex({
              index: targetIndex,
              animated: true,
              viewPosition: 0, // 상단에서 10% 지점에 위치
            });
            miniCalendarRef.current?.focusDate(date);
          } catch {
            // scrollToIndex 실패 시 대안으로 scrollToOffset 사용
            sessionLogListRef.current?.scrollToOffset({
              offset: targetIndex * 100, // 대략적인 아이템 높이 추정
              animated: true,
            });
          }
        }
      }
    },
    [handleDateSelect, matchedSessionList],
  );

  // 스크롤 이벤트 처리
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;

      if (offsetY < 0) {
        // 최상단: 캘린더 포커스 해제하고 펼치기
        miniCalendarRef.current?.setCollapsed(false);
        miniCalendarRef.current?.focusDate(null);
      } else if (offsetY > 0) {
        // 아래로 스크롤: 캘린더 접기
        const isFocused = !!miniCalendarRef.current?.getCurrentFocusedDate();

        if (!isFocused) {
          if (matchedSessionList.length > 0) {
            miniCalendarRef.current?.focusDate(
              dayjs(matchedSessionList[0][0]).toDate(),
            );
          }
        }
        miniCalendarRef.current?.setCollapsed(true);
      }
    },
    [matchedSessionList],
  );

  // 리스트 스크롤에 따른 캘린더 포커스 변경(리스트 터치에 의해서만 작동)
  const onViewableItemsChanged = useMemo(
    () =>
      debounce(
        ({
          viewableItems,
        }: {
          viewableItems: ViewToken<[string, SessionLog[]]>[];
        }) => {
          if (viewableItems.length > 0) {
            // 화면에 보이는 첫 번째 아이템의 날짜로 캘린더 포커스 변경
            const firstVisibleItem =
              viewableItems[viewableItems.length - 1].item;
            const dateString = firstVisibleItem[0]; // "YYYY-MM-DD" 형식

            // 안전한 날짜 파싱 유틸 함수 사용
            const focusDate = dayjs(dateString).toDate();

            if (focusDate) {
              miniCalendarRef.current?.focusDate(focusDate);
            }
          }
        },
        500,
      ),
    [],
  );

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 40, // 50% 이상 보일 때
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <Header headerName="내 연습 내역" LeftButton={"arrow-back"} />
      <MiniCalendar
        ref={miniCalendarRef}
        dateItems={dailySessionColors}
        onDateSelect={handleDateSelectWithScroll}
        currentMonth={currentMonth}
        incrementMonth={incrementMonth}
        decrementMonth={decrementMonth}
      />
      <SessionLogList
        ref={sessionLogListRef}
        sessions={matchedSessionList}
        isLoading={isLoadingSessionLog}
        onSessionPress={(sessionId) => handleSessionPress(sessionId)}
        onViewableItemsChanged={onViewableItemsChanged}
        onScroll={handleScroll}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

export default MySessionLogPage;
