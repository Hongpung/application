import { useFullCalendar } from "./useFullCalendar";

import { View, Text, Alert, Pressable, StyleSheet } from "react-native";

import { Color, Icons } from "@hongpung/src/common";
import { useLoadMonthlyReservationsFetch } from "@hongpung/src/entities/reservation";

type FullCalendarProps = {
    onClickDate: (date: Date) => void
}

export const FullCalendar: React.FC<FullCalendarProps> = ({ onClickDate }) => {

    const today = new Date();

    const { calendarMonth, datesInMonth, incrementMonth, decrementMonth } = useFullCalendar();
    
    const { data: reservationsData, isLoading, error: isError } = useLoadMonthlyReservationsFetch({ calendarMonth });

    if (isLoading) return (
        <View>
            <Text>
                로딩중...
            </Text>
        </View>
    )

    if (isError || reservationsData === null) {

        Alert.alert('오류', isError?.message || '알 수 없는 오류입니다.', [{ text: '확인', onPress: () => { } }])

        return (
            <View>
                <Text>
                    오류
                </Text>
            </View>
        )

    }

    return (
        <View>
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
                {datesInMonth.map((week, index) => {
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
                                                {reservationsData[day] && reservationsData[day].slice(0, 3).map((obj, index) => {

                                                    const color = obj.color == 'grey' ? obj.color + '300' : obj.color + '500';

                                                    return (
                                                        <View key={calendarMonth.getMonth() + day + index} style={{ height: 4, backgroundColor: Color[color], width: 28, borderRadius: 5, marginTop: 2 }} />
                                                    )
                                                })
                                                }
                                            </View>
                                            {reservationsData[day]?.length > 3 && <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'], marginTop: 2 }}>+{reservationsData[day].length - 3}</Text>}
                                        </Pressable>
                                    );
                                }
                            })}
                        </View>
                    )
                })}
                <View style={{ height: 8 }} />
            </View>
        </View>
    )

}



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