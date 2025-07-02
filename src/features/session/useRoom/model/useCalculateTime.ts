import { ThisSessionState } from "@hongpung/src/entities/session";
import { useCallback, useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import dayjs from "dayjs";

export const useCalculateTime = () => {
  const usingSession = useAtomValue(ThisSessionState);

  const [remainingHour, setRemainingHour] = useState("00시간");
  const [remainingMinute, setRemainingMinute] = useState("00분");

  const [canExtand, setExtendPossible] = useState(true);
  const [canReturn, setcanReturnPossible] = useState(true);

  const calculateTimeDifference = useCallback(() => {
    if (usingSession) {
      const now = dayjs().toDate();

      // 목표 시각 생성
      const [endHours, endMinutes] = usingSession?.endTime
        .split(":")
        .map(Number);

      const endDate = dayjs(now)
        .hour(endHours)
        .minute(endMinutes)
        .second(0)
        .millisecond(0)
        .toDate();

      // 시간 차이 계산
      const diffForEnd = dayjs(endDate).diff(dayjs(now), "minutes");
      if (diffForEnd <= 15) {
        setExtendPossible(false);
      }

      const [startHours, startMinutes] = usingSession?.startTime
        .split(":")
        .map(Number);

      const startDate = dayjs(now)
        .hour(startHours)
        .minute(startMinutes)
        .second(0)
        .millisecond(0)
        .toDate();

      const diffForReturn = dayjs(now).diff(dayjs(startDate), "minutes");
      if (diffForReturn >= 15) {
        setcanReturnPossible(true);
      }

      const diffHours = Math.floor(diffForEnd / 60);
      const diffMinutes = diffForEnd % 60;

      setRemainingHour(`${String(diffHours).padStart(2, "0")}시간`);
      setRemainingMinute(`${String(diffMinutes).padStart(2, "0")}분`);
    }
  }, [usingSession]);

  useEffect(() => {
    // 초기 시간 계산
    calculateTimeDifference();

    // 1초마다 시간 업데이트
    const interval = setInterval(calculateTimeDifference, 1000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
  }, [usingSession?.endTime, calculateTimeDifference]);

  return { remainingHour, remainingMinute, canExtand, canReturn };
};
