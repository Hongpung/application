import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Pressable, View, Text, StyleSheet, Dimensions, ActivityIndicator, Modal } from "react-native";
import { Color } from "@hongpung/ColorSet";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import useFetchUsingToken from "@hongpung/src/common/hooks/useFetchUsingToken";
import { Icons } from "@hongpung/src/common/components/icons/Icon";
import { ReservationStackParamList } from "@hongpung/nav/ReservationStack";

type ReservationType = 'COMMON' | 'REGULAR' | 'EXTERNAL'

interface MonthlyReservation {

    date: string;
    participationAvailable: boolean;
    reservationId: number;
    reservationType: ReservationType;

}

export const Calendar: React.FC<{ onClickDate: (date: Date) => void, calendarDate?: Date }> = ({ onClickDate, calendarDate }) => {

    const [calendarMonth, setMonth] = useState(calendarDate ?? new Date())
    const [daysInMonth, setDaysInMonth] = useState<number[][]>([]);
    const [reservedDates, setReservedDates] = useState<{ [key: number]: { color: string }[] }>([]);
    const isFocusing = useIsFocused();

    const today = new Date();

    const prevDays = useCallback((day: number) => {
        if (day == 0) return 6;
        return day - 1;
    }, [])

    // 토큰을 불러온 후 useFetch 실행
    const { data, loading, error } = useFetchUsingToken<MonthlyReservation[]>(
        `${process.env.EXPO_PUBLIC_BASE_URL}/reservation/month-calendar?year=${calendarMonth.getFullYear()}&month=${calendarMonth.getMonth() + 1}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }, 2000, [calendarMonth, isFocusing]
    );

    const colorDefine = ({ reservationType, participationAvailable }: { reservationType?: ReservationType, participationAvailable: boolean }) => {
        if (reservationType === 'EXTERNAL') return 'grey'
        if (reservationType === 'REGULAR') return 'blue';
        if (participationAvailable) return 'green';//
        return 'red';
    };


    useEffect(() => {
        if (data) {
            const reservedDates: { [key: number]: { color: string }[] } = [];
            data.map((reserve) => {
                const reserveDate = new Date(reserve.date).getDate();
                if (!reservedDates[reserveDate]) reservedDates[reserveDate] = [{ color: colorDefine(reserve) }];
                else reservedDates[reserveDate] = [...reservedDates[reserveDate], { color: colorDefine(reserve) }];
            })

            setReservedDates(reservedDates);
        }
    }, [data])

    const incrementMonth = () => {
        const newDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
        setMonth(newDate);
        setReservedDates([]);
    };

    const decrementMonth = () => {
        const newDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
        setMonth(newDate);
        setReservedDates([]);
    };

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

    return (
        <View>
            <Modal visible={loading} transparent>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <ActivityIndicator size={'large'} color={'#FFF'} />
                </View>
            </Modal>
            <Text style={{ textAlign: 'center', fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>{`${calendarMonth.getFullYear()}년`}</Text>
            <View style={{ height: 8 }} />
            <View style={styles.MonthRow}>
                <Pressable style={styles.MonthBtn}
                    onPress={decrementMonth} >

                    <Icons size={24} name={'chevron-back'} color={Color['blue500']} />
                </Pressable>
                <Text style={styles.MonthNumber}>
                    {`${calendarMonth.getMonth() + 1}월`}
                </Text>
                <Pressable style={styles.MonthBtn}
                    onPress={incrementMonth} >
                    <Icons size={24} name={'chevron-forward'} color={Color['blue500']} />
                </Pressable>
            </View>
            <View style={{ height: 32 }} />
            <View>
                <View style={{ flexDirection: 'row', marginHorizontal: 32, justifyContent: 'space-around' }}>
                    <Text key={'mon'} style={styles.DayText}>월</Text>
                    <Text key={'tue'} style={styles.DayText}>화</Text>
                    <Text key={'wed'} style={styles.DayText}>수</Text>
                    <Text key={'thu'} style={styles.DayText}>목</Text>
                    <Text key={'fri'} style={styles.DayText}>금</Text>
                    <Text key={'sat'} style={styles.DayText}>토</Text>
                    <Text key={'sun'} style={styles.DayText}>일</Text>
                </View>
                <View style={{ height: 20 }} />
                {daysInMonth.map((week, index) => {
                    return (
                        <View key={'week-' + index} style={{ flexDirection: 'row', marginHorizontal: 32, justifyContent: 'space-around' }}>
                            {week.map((day, index) => {
                                if (day == 0) return (<View key={'empty' + index} style={{ width: 32, height: 32 }} />)
                                else {
                                    const thisDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                                    const textColor = thisDate < today ? Color['grey300'] : Color['grey400'];
                                    return (
                                        <Pressable key={`date-${day}`}
                                            style={{ height: 60, width: 32, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: (day == today.getDate()) && (calendarMonth.getMonth() == today.getMonth()) ? Color['blue100'] : 'transparent', borderRadius: 5 }}
                                            onPress={() => onClickDate(new Date(`${calendarMonth.getFullYear()}-${calendarMonth.getMonth() + 1}-${day}`))}
                                        >
                                            <Text style={[styles.CalendarText, { color: (day == today.getDate()) && (calendarMonth.getMonth() == today.getMonth()) ? Color['blue600'] : textColor }]}>{day}</Text>
                                            <View style={{ marginHorizontal: 2, height: 16, flexDirection: 'column-reverse', marginTop: 4 }}>
                                                {reservedDates[day] && reservedDates[day].slice(0, 3).map((obj, index) => {

                                                    const color = obj.color == 'grey' ? obj.color + '300' : obj.color + '500';

                                                    return (
                                                        <View key={calendarMonth.getMonth() + day + index} style={{ height: 4, backgroundColor: Color[color], width: 28, borderRadius: 5, marginTop: 2 }} />
                                                    )
                                                })
                                                }
                                            </View>
                                            {reservedDates[day]?.length > 3 && <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'], marginTop: 2 }}>+{reservedDates[day].length - 3}</Text>}
                                        </Pressable>
                                    );
                                }
                            })}
                        </View>
                    )
                })}
                <View style={{ height: 8 }} />
            </View>
        </View >
    );
}


type ReserveCalendarProps = NativeStackScreenProps<ReservationStackParamList, 'ReserveCalendar'>

const ReservationCalendarScreen: React.FC<ReserveCalendarProps> = ({ navigation, route }) => {

    const [calendarDate, setCalendarDate] = useState(new Date())

    useFocusEffect(
        useCallback(() => {
            if (route.params?.date) {
                const newDate = new Date(route.params.date);
                if (calendarDate.getDate() != newDate.getDate()) {
                    setCalendarDate(newDate);
                }
            }
        }, [route.params?.date])
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ position: 'absolute', right: 32, top: 28, gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: Color['blue500'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>정규 일정</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: Color['red500'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>참여 불가</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: Color['green500'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>참여 가능</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: Color['grey300'], height: 4, width: 20, borderRadius: 5, marginRight: 8 }} />
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>외부 예약</Text>
                </View>
            </View>
            <View style={{ marginTop: 88, flex: 1 }}>
                <Calendar
                    calendarDate={calendarDate}
                    onClickDate={(date: Date) => {
                        navigation.push(`DailyReserveList`, { date: date.toISOString() })
                    }} />
            </View>
            {/* <View style={{ position: 'absolute', width: width, bottom: 12 }}>
                <Pressable style={{ marginHorizontal: 24, height: 88, backgroundColor: Color['grey200'], borderRadius: 10 }}
                    onPress={() => {
                        // navigation.replace('ExtaraActivities', { animation: 'none' });
                    }}>
                    <View style={{ width: 56, height: 56, backgroundColor: Color['grey700'], borderRadius: 200, top: 16, left: 12 }} />
                    <Text style={{ position: 'absolute', top: 16, right: 12, fontSize: 18, fontFamily: 'NanumSquareNeo-ExtraBold', color: Color['grey700'] }}>다른 활동을 찾고 계셨나요?</Text>
                    <Text style={{ position: 'absolute', bottom: 12, right: 12, fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>{`활동 둘러보러 가기 >`}</Text>
                </Pressable>
            </View> */}
        </View>
    )
}

export default ReservationCalendarScreen;


const styles = StyleSheet.create({
    MonthRow: {
        height: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    MonthNumber: {
        width: 56,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'NanumSquareNeo-Bold',
        color: Color['grey700']
    },
    MonthBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
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
        marginVertical: 2,
    }
})