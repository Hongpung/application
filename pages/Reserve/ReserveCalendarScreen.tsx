import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Pressable, View, Text, StyleSheet, Dimensions } from "react-native";
import { Color } from "../../ColorSet";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get(`window`);

const Calendar: React.FC<{ onClickDate: (date: Date) => void, calendarDate?: Date }> = ({ onClickDate, calendarDate }) => {

    const [calendarMonth, setMonth] = useState(calendarDate ?? new Date())
    const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

    const today = new Date();

    const prevDays = (day: number) => {
        if (day == 0) return 6;
        return day - 1;
    }
    useEffect(()=>{
        calendarDate&&setMonth(calendarDate)
    },[calendarDate])

    useLayoutEffect(() => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const daysArray = [];
        for (let i = 0; i < prevDays(firstDayOfMonth.getDay()); i++) {
            daysArray.push(0);
        }

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            daysArray.push(i);
        }

        while (daysArray.length % 7 !== 0) {
            daysArray.push(0);
        }


        setDaysInMonth(daysArray);
    }, [calendarMonth]);


    const incrementMonth = () => {
        const newDate = new Date(calendarMonth);
        console.log('증가')
        newDate.setMonth(calendarMonth.getMonth() + 1);
        setMonth(newDate);
    };

    const decrementMonth = () => {
        console.log('감소')
        const newDate = new Date(calendarMonth);
        newDate.setMonth(calendarMonth.getMonth() - 1);
        setMonth(newDate);
    };

    const renderWeeks = () => {
        const weeks: any[] = [];
        let days: any[] = [];

        daysInMonth.forEach((day, index) => {
            if (day == 0) days.push(<View style={{ width: 32, height: 32 }} />)
            else {
                days.push(
                    <Pressable key={`date-${day}`}
                        style={{ height: 60, width: 32, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: (day == today.getDate()) && (calendarMonth.getMonth() == today.getMonth()) ? Color['blue100'] : 'transparent', borderRadius: 5 }}
                        onPress={() => onClickDate(new Date(`${calendarMonth.getFullYear()}-${calendarMonth.getMonth() + 1}-${day}`))}
                    >
                        <Text style={[styles.CalendarText, (day == today.getDate()) && (calendarMonth.getMonth() == today.getMonth()) ? { color: Color['blue600'] } : null]}>{day}</Text>
                        <View style={{ marginHorizontal: 2, height: 16, flexDirection: 'column-reverse', marginTop: 4 }}>
                            {day % (12 - today.getDay()) == 0 && <View style={{ height: 4, backgroundColor: Color['red500'], width: 28, borderRadius: 5, marginTop: 2 }} />}
                            {day % (calendarMonth.getMonth() - 6) == 0 && <View style={{ height: 4, backgroundColor: Color['green500'], width: 28, borderRadius: 5, marginTop: 2 }} />}
                            {day % 4 == 0 && <View style={{ height: 4, backgroundColor: Color['blue500'], width: 28, borderRadius: 5, marginTop: 2 }} />}
                        </View>
                        {day % 8 == 0 && <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'], marginTop: 2 }}>+3</Text>}
                    </Pressable>
                );
            }

            if ((index + 1) % 7 === 0) {
                weeks.push(
                    <View key={'day-' + index} style={{ flexDirection: 'row', marginHorizontal: 32, justifyContent: 'space-around' }}>
                        {days}
                    </View>
                );
                weeks.push(<View key={`space-${index}`} style={{ height: 8 }} />);
                days = [];
            }
        });

        return weeks;
    };


    return (
        <View>
            <Text style={{ textAlign: 'center', fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>{`${calendarMonth.getFullYear()}년`}</Text>
            <View style={{ height: 8 }} />
            <View style={styles.MonthRow}>
                <Pressable style={styles.MonthBtn}
                    onPress={decrementMonth} />
                <Text style={styles.MonthNumber}>
                    {`${calendarMonth.getMonth() + 1}월`}
                </Text>
                <Pressable style={styles.MonthBtn}
                    onPress={incrementMonth} />
            </View>
            <View style={{ height: 32 }} />
            <View>
                <View style={{ flexDirection: 'row', marginHorizontal: 32, justifyContent: 'space-around' }}>
                    <Text style={styles.DayText}>월</Text>
                    <Text style={styles.DayText}>화</Text>
                    <Text style={styles.DayText}>수</Text>
                    <Text style={styles.DayText}>목</Text>
                    <Text style={styles.DayText}>금</Text>
                    <Text style={styles.DayText}>토</Text>
                    <Text style={styles.DayText}>일</Text>
                </View>
                <View style={{ height: 20 }} />
                {renderWeeks()}
                <View style={{ height: 8 }} />
            </View>
        </View>
    );
}

const ReserveCalendarScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

    const [calendarDate, setCalendarDate] = useState(new Date())

    useFocusEffect(
        useCallback(() => {
            if (route.params?.date) {
                const newDate = new Date(route.params.date);
                console.log(newDate)
                if (calendarDate.getTime() !== newDate.getTime()) {
                    setCalendarDate(newDate);
                }
            }
        }, [route.params?.date])
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ position: 'absolute', right: 32, top: 30 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: Color['blue500'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>정규 일정</Text>
                </View>
                <View style={{ height: 4 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: Color['red500'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>참여 불가</Text>
                </View>
                <View style={{ height: 4 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: Color['green500'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>참여 가능</Text>
                </View>
            </View>
            <View style={{ marginTop: 88, flex: 1 }}>
                <Calendar
                    calendarDate={calendarDate}
                    onClickDate={(date: Date) => {
                        navigation.push(`DailyReserveList`, { date: date.getTime() })
                    }} />
            </View>
            <View style={{ position: 'absolute', width: width, bottom: 12 }}>
                <View style={{ marginHorizontal: 24, height: 88, backgroundColor: Color['grey200'], borderRadius: 10 }}>
                    <View style={{ width: 56, height: 56, backgroundColor: Color['grey700'], borderRadius: 200, top: 16, left: 12 }} />
                    <Text style={{ position: 'absolute', top: 16, right: 12, fontSize: 18, fontFamily: 'NanumSquareNeo-ExtraBold', color: Color['grey700'] }}>다른 활동을 찾고 계셨나요?</Text>
                    <Text style={{ position: 'absolute', bottom: 12, right: 12, fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>{`활동 둘러보러 가기 >`}</Text>
                </View>
            </View>
        </View>
    )
}

export default ReserveCalendarScreen;

export { Calendar }


const styles = StyleSheet.create({
    MonthRow: {
        height: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    MonthNumber: {
        textAlign: 'center',
        fontSize: 20,
        marginHorizontal: 4,
        fontFamily: 'NanumSquareNeo-Bold',
        color: Color['grey700']
    },
    MonthBtn: {
        width: 28,
        height: 28,
        backgroundColor: Color['blue500']
    },
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
        color: Color['grey400'],
        marginVertical: 2,
    }
})