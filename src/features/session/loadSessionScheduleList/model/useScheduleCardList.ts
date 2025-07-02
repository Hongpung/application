import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import { isOpen, timeToDate } from "@hongpung/src/entities/session";
import type { ScheduleCard, Session } from "@hongpung/src/entities/session";
import dayjs from "dayjs";

export const useScheduleCardList = (sessionList: Session[] | null) => {
  const [isOnAir, setOnAir] = useState<
    "PREPARING" | "ON_AIR" | "CLOSED" | "AVAILABLE"
  >("AVAILABLE");
  const [isParticipatible, setParticipatible] = useState(false);
  const [scheduleCardList, setScheduleCardList] = useState<ScheduleCard[]>([]);
  const [slideToIndex, setSlideToIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const cardViewRef = useRef<FlatList>(null);

  // 예약 세션 시작 시간이 현재 시간보다 40분 이상 남았는지 확인
  const isSessionStartInTime = useCallback((session: Session): boolean => {
    const now = dayjs().toDate();

    const sessionStartTime = timeToDate(session.startTime);

    const timeGap = dayjs(sessionStartTime).diff(dayjs(now), "minute");

    return timeGap > 40;
  }, []);

  // 예약 세션 처리 함수
  const handleReservedSession = useCallback(
    (
      session: Session,
      index: number,
      sessionList: Session[],
      fetchReservationCards: ScheduleCard[],
      slideTo: { index: number | null },
    ) => {
      if (session.status === "AFTER" || session.status === "DISCARDED") {
        fetchReservationCards.push({ type: "session", session });
        if (!sessionList[index + 1] && isOpen) {
          slideTo.index = index + 1;
          fetchReservationCards.push({
            type: "empty",
            nextReservationTime: "없음",
          });
        }
      } else if (session.status === "ONAIR") {
        slideTo.index = index;
        setOnAir("ON_AIR");
        setParticipatible(session.participationAvailable);
        fetchReservationCards.push({ type: "session", session });
      } else if (session.status === "BEFORE") {
        if (slideTo.index === null) {
          slideTo.index = index;
          if (isSessionStartInTime(session) && isOpen) {
            fetchReservationCards.push({
              type: "empty",
              nextReservationTime: session.startTime,
            });
          } else if (isOpen) {
            setOnAir("PREPARING");
          }
        }
        fetchReservationCards.push({ type: "session", session });
      }
    },
    [isSessionStartInTime],
  );

  // 실시간 세션 처리 함수
  const handleRealtimeSession = useCallback(
    (
      session: Session,
      index: number,
      sessionList: Session[],
      fetchReservationCards: ScheduleCard[],
      slideTo: { index: number | null },
    ) => {
      fetchReservationCards.push({ type: "session", session });
      if (session.status === "ONAIR") {
        setOnAir("ON_AIR");
        setParticipatible(session.participationAvailable);
      } else if (!sessionList[index + 1] && isOpen) {
        slideTo.index = index + 1;
        fetchReservationCards.push({
          type: "empty",
          nextReservationTime: "없음",
        });
      }
    },
    [],
  );

  useEffect(() => {
    if (!sessionList) return;

    setIsLoading(true);
    const slideTo: { index: number | null } = { index: null };
    const fetchReservationCards: ScheduleCard[] = [];

    const sortedSessionList = sessionList.sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );

    setOnAir("AVAILABLE"); // onAir 상태 초기화

    sortedSessionList.forEach((session, index) => {
      if (session.sessionType === "RESERVED") {
        handleReservedSession(
          session,
          index,
          sortedSessionList,
          fetchReservationCards,
          slideTo,
        );
      } else if (session.sessionType === "REALTIME") {
        handleRealtimeSession(
          session,
          index,
          sortedSessionList,
          fetchReservationCards,
          slideTo,
        );
      }
    });
    if (!isOpen) {
      setOnAir("CLOSED");
    }
    // 슬라이드 인덱스 설정
    if (!slideTo.index && fetchReservationCards.length > 1) {
      slideTo.index = fetchReservationCards.length - 1;
    }
    setScheduleCardList(fetchReservationCards);
    setSlideToIndex(slideTo.index ?? 0);
    setIsLoading(false);
  }, [sessionList, handleReservedSession, handleRealtimeSession]);

  useEffect(() => {
    if (slideToIndex !== null && slideToIndex < scheduleCardList.length) {
      cardViewRef.current?.scrollToIndex({
        index: slideToIndex,
        animated: true,
      });
    }
  }, [slideToIndex, scheduleCardList]);

  return {
    isOnAir,
    isParticipatible,
    scheduleCardList,
    cardViewRef,
    isLoading,
  };
};
