import { useCallback, useEffect, useState } from "react";

export const useFullCalendar = (currentDate?: Date) => {

    const [calendarMonth, setMonth] = useState(currentDate ?? new Date())// 달력의 날짜F
    const [datesInMonth, setDatesInMonth] = useState<number[][]>([[]]); //날짜 배열

    const incrementMonth = () => {
        const newDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
        setMonth(newDate);
    };

    const decrementMonth = () => {
        const newDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
        setMonth(newDate);
    };

    //시작하는 요일을 반환 (월요일 시작을 기준으로)
    const prevDays = useCallback((day: number) => {
        if (day == 0) return 6;
        return day - 1;
    }, [])

    //달력의 날짜 배열 (숫자 2차 배열)
    const makeMonthDateArray = useCallback((calendarMonth: Date) => {

        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // 첫 주의 공백을 채우기 위한 빈칸 추가
        const emptyDays = Array.from({ length: prevDays(firstDayOfMonth.getDay()) }, () => 0);

        // 이번 달의 날짜를 배열로 생성
        const monthDays = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
        const fullDaysArray = [...emptyDays, ...monthDays];

        // 마지막 주를 7일로 채우기 위해 빈칸 추가
        const fullMonth = [
            ...fullDaysArray,
            ...Array.from({ length: 7 - (fullDaysArray.length % 7 || 7) }, () => 0)
        ];

        // 7일씩 나누어 주 단위로 분리
        const weeks = fullMonth.reduce((acc: number[][], day, index) => {
            if (index % 7 === 0) acc.push([]);
            acc[acc.length - 1].push(day);
            return acc;
        }, []);

        setDatesInMonth(weeks);

    }, []);

    useEffect(() => {
        makeMonthDateArray(calendarMonth)
    }, [calendarMonth]);

    return { datesInMonth, calendarMonth, decrementMonth, incrementMonth }

}