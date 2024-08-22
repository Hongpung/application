import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Color } from '../../../../ColorSet'
import PracticeCard from '../../../../components/cards/PracticeCard'

const ClubCalendar: React.FC<{ navigation: any }> = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <ScrollView contentContainerStyle={{ backgroundColor: '#FFF' }}>
                <Calendar />
                <PrevPracticeList prevPractice={[1, 4, 5, 1, 4, 5]} onPress={() => navigation.push('PracticeInfo')} />
            </ScrollView>
        </View>
    )
}

const Calendar: React.FC = () => {
    const [calendarMonth, setMonth] = useState(new Date)
    const [selectedDate, setDate] = useState<number | null>(null)
    const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

    const prevDays = (day: number) => {
        if (day == 0) return 6;
        return day - 1;
    }

    const filterLogforDate = (date: number) => {
        const newDate = new Date(calendarMonth);
        newDate.setDate(date);
        setDate(date)
    }
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
        newDate.setMonth(calendarMonth.getMonth() + 1);
        setMonth(newDate);
        setDate(null);
    };

    const decrementMonth = () => {
        const newDate = new Date(calendarMonth);
        newDate.setMonth(calendarMonth.getMonth() - 1);
        setMonth(newDate);
        setDate(null);
    };

    const renderWeeks = () => {
        const weeks: any[] = [];
        let days: any[] = [];

        daysInMonth.forEach((day, index) => {
            if (day == 0) days.push(<View style={{ width: 32, height: 32 }} />)
            else {
                days.push(
                    <Pressable key={`date-${day}`}
                        style={{ height: 32, width: 32, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: day == selectedDate ? Color['blue100'] : 'transparent', borderRadius: 5 }}
                        onPress={() => {
                            if (selectedDate == day) setDate(null);
                            else filterLogforDate(day);
                        }}
                    >
                        <Text style={[styles.CalendarText, day == selectedDate ? { color: Color['blue600'] } : null]}>{day}</Text>
                    </Pressable>
                );
            }

            if ((index + 1) % 7 === 0) {
                weeks.push(
                    <View key={index} style={{ flexDirection: 'row', marginHorizontal: 48, width: 320, justifyContent: 'space-around' }}>
                        {days}
                    </View>
                );
                weeks.push(<View key={`space-${index}`} style={{ height: 4 }} />);
                days = [];
            }
        });

        return weeks;
    };


    return (
        <View>
            <View style={{ height: 16 }} />
            <Text style={{ marginLeft: 32, marginBottom: 8, fontSize: 16, color: Color['grey400'], fontFamily: 'NanumSquareNeo-Bold' }}>
                {calendarMonth.getFullYear()}년
            </Text>
            <View style={styles.MonthRow}>
                <Pressable style={styles.MonthBtn}
                    onPress={decrementMonth} />
                <Text style={styles.MonthNumber}>
                    {calendarMonth.getMonth() + 1}월
                </Text>
                <Pressable style={styles.MonthBtn}
                    onPress={incrementMonth} />
            </View>
            <View style={{ height: 12 }} />
            <View style={{ alignItems: 'center', }}>
                <View style={{ flexDirection: 'row', marginHorizontal: 48, width: 320, justifyContent: 'space-around' }}>
                    <Text style={styles.DayText}>월</Text>
                    <Text style={styles.DayText}>화</Text>
                    <Text style={styles.DayText}>수</Text>
                    <Text style={styles.DayText}>목</Text>
                    <Text style={styles.DayText}>금</Text>
                    <Text style={styles.DayText}>토</Text>
                    <Text style={styles.DayText}>일</Text>
                </View>
                <View style={{ height: 8 }} />
                {renderWeeks()}
                <View style={{ height: 8 }} />
            </View>
        </View>
    );
}


const PrevPracticeList: React.FC<{ prevPractice: any[], onPress: () => void }> = ({ prevPractice, onPress }) => {
    return (
        <View style={{ flex: 1 }}>
            {prevPractice.map(value => <View style={{ marginVertical: 6 }}><PracticeCard date={new Date} onPress={onPress} /></View>)}
        </View>
    )
}

export default ClubCalendar

const styles = StyleSheet.create({
    MonthRow: {
        height: 24,
        marginHorizontal: 32,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    MonthNumber: {
        width: 56,
        textAlign: 'center',
        fontSize: 20,
        marginHorizontal: 4,
        fontFamily: 'NanumSquareNeo-Bold',
        color: Color['grey700']
    },
    MonthBtn: {
        width: 28,
        height: 28,
        backgroundColor: Color['grey400']
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