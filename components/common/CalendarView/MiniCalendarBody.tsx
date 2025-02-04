import { useCalendar } from "./useCalendar.context";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { Color } from "@hongpung/ColorSet";
import { View, Pressable, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window')

const useMiniCalendarBody = () => {

    const { selectedDate, setDate, calendarMonth, dailyReservations } = useCalendar();

    //week,date 위치 배열
    const [daysInMonth, setDaysInMonth] = useState<number[][]>([]);

    const prevDays = (day: number) => {
        if (day == 0) return 6;
        return day - 1;
    }

    const selectDate = (date: number) => {
        const newDate = new Date(calendarMonth);
        newDate.setDate(date);
        setDate(newDate);
    }

    const unSelectDate = () => { setDate(null); }

    const toggleDate = (date: number) => {
        console.log(date, selectedDate?.getDate() == date, selectedDate)
        if (selectedDate?.getDate() == date) { unSelectDate(); return; }
        selectDate(date);
    }

    const makeMonthDateArray = useCallback(() => {

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

        setDaysInMonth(weeks);

    }, [calendarMonth]);


    useLayoutEffect(() => {
        makeMonthDateArray()
    }, [calendarMonth]);

    return { selectedDate, toggleDate, dailyReservations, calendarMonth, daysInMonth }

}

const WeekDaysRow: React.FC = () => {
    return (
        <View style={{ flexDirection: 'row', width: '100%', paddingVertical: 4, justifyContent: 'space-around' }}>
            <Text style={styles.DayText}>월</Text>
            <Text style={styles.DayText}>화</Text>
            <Text style={styles.DayText}>수</Text>
            <Text style={styles.DayText}>목</Text>
            <Text style={styles.DayText}>금</Text>
            <Text style={styles.DayText}>토</Text>
            <Text style={styles.DayText}>일</Text>
        </View>
    )
}

export const MiniCalendarBody: React.FC = () => {

    const { selectedDate, daysInMonth, dailyReservations, toggleDate } = useMiniCalendarBody();

    return (

        <View style={{ width: '100%', paddingHorizontal: (width - 320) / 2, gap: 4 }}>

            <WeekDaysRow />

            {
                daysInMonth.map((week, index) => {
                    return (
                        <>
                            <View key={'weeks' + index} style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                                {
                                    week.map((day, date_index) => {
                                        if (day == 0) return (<View key={'empty-' + index +'/'+ date_index} style={{ width: 32, height: 32 }} />)
                                        else {
                                            const dailyReservationData = dailyReservations[day];

                                            return (
                                                <Pressable key={`date-${day}`}
                                                    style={{ display: 'flex', height: 32, width: 32, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: day == selectedDate?.getDate() ? Color['blue100'] : 'transparent', borderRadius: 5 }}
                                                    onPress={() => {
                                                        !!dailyReservationData &&toggleDate(day)
                                                    }}
                                                >
                                                    <Text style={[styles.CalendarText, !!dailyReservationData && { color: Color['grey600'] }, day == selectedDate?.getDate() && { color: Color['blue600'] }]}>{day}</Text>
                                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 2, gap: 2 }}>
                                                        {!!dailyReservationData &&
                                                            dailyReservationData.slice(0, 3).map(reservation => (
                                                                <View style={{ width: 4, height: 4, borderRadius: 20, backgroundColor: Color[reservation.color + "500"] }} />))
                                                        }
                                                    </View>
                                                </Pressable>
                                            )
                                        }

                                    })
                                }
                            </View>
                        </>
                    )
                })
            }
        </View>)
}



const styles = StyleSheet.create({

    DayText: {
        width: 28,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'NanumSquareNeo-Bold',
        color: Color['grey500'],
    },
    CalendarText: {
        width: 28,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'NanumSquareNeo-Bold',
        color: Color['grey300'],
        marginVertical: 2,
    }
})