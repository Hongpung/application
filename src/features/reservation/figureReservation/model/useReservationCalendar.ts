import { useCallback, useEffect, useState } from "react";
import { useLoadMonthlyReservationsFetch } from "@hongpung/src/entities/reservation";

export const useReservationCalendar = (initialDate?: string | undefined) => {

    const [calendarMonth, setCalendarMonth] = useState(initialDate ? new Date(initialDate): new Date());
    const [datesInMonth, setDatesInMonth] = useState<number[][]>([[]]);

    const { data: reservationsData, isLoading, error } = useLoadMonthlyReservationsFetch({ calendarMonth });

    const incrementMonth = useCallback(() => {
        const nextMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
        setCalendarMonth(nextMonth);
    }, [calendarMonth]);

    const decrementMonth = useCallback(() => {
        const prevMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
        setCalendarMonth(prevMonth);
    }, [calendarMonth]);

    const prevDays = useCallback((day: number) => {
        return day === 0 ? 6 : day - 1;
    }, []);

    const makeMonthDateArray = useCallback((calendarMonth: Date) => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const emptyDays = Array.from({ length: prevDays(firstDayOfMonth.getDay()) }, () => 0);
        const monthDays = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
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
    }, [prevDays]);

    useEffect(() => {

        makeMonthDateArray(calendarMonth);

    }, [calendarMonth, makeMonthDateArray]);

    return {
        calendarMonth,
        datesInMonth,
        reservationsData,
        isLoading,
        error,
        incrementMonth,
        decrementMonth,
    };
};