import { useCallback, useEffect, useState } from "react";
import { useLoadMonthlyReservationsFetch } from "@hongpung/src/entities/reservation";
import dayjs from "dayjs";

export const useReservationCalendar = (initialDate?: string | undefined) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(
    dayjs(initialDate).toDate(),
  );
  const [datesInMonth, setDatesInMonth] = useState<number[][]>([[]]);

  const {
    data: reservationsData,
    isLoading,
    error,
  } = useLoadMonthlyReservationsFetch({ calendarMonth });

  const incrementMonth = useCallback(() => {
    setCalendarMonth(dayjs(calendarMonth).add(1, "month").toDate());
  }, [calendarMonth]);

  const decrementMonth = useCallback(() => {
    setCalendarMonth(dayjs(calendarMonth).subtract(1, "month").toDate());
  }, [calendarMonth]);

  const prevDays = useCallback((day: number) => {
    return day === 0 ? 6 : day - 1;
  }, []);

  const makeMonthDateArray = useCallback(
    (calendarMonth: Date) => {
      const firstDayOfMonth = dayjs(calendarMonth).startOf("month");
      const lastDayOfMonth = dayjs(calendarMonth).endOf("month");

      const emptyDays = Array.from(
        { length: prevDays(firstDayOfMonth.day()) },
        () => 0,
      );
      const monthDays = Array.from(
        { length: lastDayOfMonth.date() },
        (_, i) => i + 1,
      );
      const fullDaysArray = [...emptyDays, ...monthDays];
      const fullMonth = [
        ...fullDaysArray,
        ...Array.from({ length: 7 - (fullDaysArray.length % 7 || 7) }, () => 0),
      ];

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

  return {
    calendarMonth,
    datesInMonth,
    reservationsData,
    isLoading,
    error,
    selectedDate,
    setSelectedDate,
    incrementMonth,
    decrementMonth,
  };
};
