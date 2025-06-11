import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

export const useFullCalendar = (initialDate?: Date) => {
  const [calendarMonth, setMonth] = useState(initialDate ?? dayjs().toDate()); // 달력의 날짜F
  const [datesInMonth, setDatesInMonth] = useState<number[][]>([[]]); //날짜 배열

  const incrementMonth = () => {
    const newDate = dayjs(calendarMonth).add(1, "month").toDate();
    setMonth(newDate);
  };

  const decrementMonth = () => {
    const newDate = dayjs(calendarMonth).subtract(1, "month").toDate();
    setMonth(newDate);
  };

  //시작하는 요일을 반환 (월요일 시작을 기준으로)
  const prevDays = useCallback((day: number) => {
    if (day === 0) return 6;
    return day - 1;
  }, []);

  //달력의 날짜 배열 (숫자 2차 배열)
  const makeMonthDateArray = useCallback(
    (calendarMonth: Date) => {
      const year = calendarMonth.getFullYear();
      const month = calendarMonth.getMonth();

      const firstDayOfMonth = dayjs().year(year).month(month).date(1);
      const lastDayOfMonth = dayjs()
        .year(year)
        .month(month + 1)
        .date(0);

      // 첫 주의 공백을 채우기 위한 빈칸 추가
      const emptyDays = Array.from(
        { length: prevDays(firstDayOfMonth.day()) },
        () => 0,
      );

      // 이번 달의 날짜를 배열로 생성
      const monthDays = Array.from(
        { length: lastDayOfMonth.date() },
        (_, i) => i + 1,
      );
      const fullDaysArray = [...emptyDays, ...monthDays];

      // 마지막 주를 7일로 채우기 위해 빈칸 추가
      const fullMonth = [
        ...fullDaysArray,
        ...Array.from({ length: 7 - (fullDaysArray.length % 7 || 7) }, () => 0),
      ];

      // 7일씩 나누어 주 단위로 분리
      const weeks = fullMonth.reduce((acc: number[][], day, index) => {
        if (index % 7 === 0) acc.push([]);
        acc[acc.length - 1].push(day);
        return acc;
      }, []);

      setDatesInMonth(weeks);
    },
    [prevDays],
  );

  useEffect(() => {
    makeMonthDateArray(calendarMonth);
  }, [calendarMonth, makeMonthDateArray]);

  return { datesInMonth, calendarMonth, decrementMonth, incrementMonth };
};
