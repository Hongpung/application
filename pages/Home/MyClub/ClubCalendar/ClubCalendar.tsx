import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Color } from '../../../../ColorSet'
import PracticeCard from '../../../../components/cards/PracticeCard'

export type Reserve = {
    date: Date;
    title: string;
    type: string;
    name: string;
    nickname?: string;
    startTime: 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21;
    endTime: 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22;
    personnel: number
}
const ClubCalendar: React.FC<{ navigation: any }> = ({ navigation }) => {

    const [selectedDate, setDate] = useState<Date | null>(null)
    const [reserveList, setReserveList] = useState<Reserve[] | null>(null)
    const [calendarMonth, setMonth] = useState(new Date)
    const [reservedDate, calcDates] = useState<number[] | null>(null)
    const PrevPractices: Reserve[] = [
        {
            date: new Date('2024-08-11'),
            title: '그냥 연습',
            type: 'regular',
            name: '홍길동',
            nickname: '길동색시',
            startTime: 17,
            endTime: 19,
            personnel: 10
        },
        {
            date: new Date('2024-08-12'),
            title: '개인 연습',
            type: 'personal',
            name: '이순신',
            nickname: '이장군',
            startTime: 10,
            endTime: 12,
            personnel: 10
        },
        {
            date: new Date('2024-08-14'),
            title: '정기 연습',
            type: 'regular',
            name: '김유신',
            nickname: '김장군',
            startTime: 15,
            endTime: 18,
            personnel: 12
        },
        {
            date: new Date('2024-08-14'),
            title: '개인 연습',
            type: 'personal',
            name: '유관순',
            startTime: 18,
            endTime: 21,
            personnel: 9
        },
        {
            date: new Date('2024-08-15'),
            title: '정기 연습',
            type: 'regular',
            name: '안중근',
            startTime: 14,
            endTime: 17,
            personnel: 10
        },
        {
            date: new Date('2024-08-16'),
            title: '개인 연습',
            type: 'personal',
            name: '윤봉길',
            startTime: 12,
            endTime: 14,
            personnel: 12
        },
        {
            date: new Date('2024-08-17'),
            title: '정기 연습',
            type: 'regular',
            name: '장보고',
            nickname: '장해적',
            startTime: 16,
            endTime: 19,
            personnel: 82
        },
        {
            date: new Date('2024-08-13'),
            title: '개인 연습',
            type: 'personal',
            name: '이성계',
            nickname: '태조',
            startTime: 11,
            endTime: 14,
            personnel: 10
        },
        {
            date: new Date('2024-08-19'),
            title: '정기 연습',
            type: 'regular',
            name: '세종대왕',
            nickname: '세종',
            startTime: 13,
            endTime: 16,
            personnel: 11
        },
        {
            date: new Date('2024-08-20'),
            title: '개인 연습',
            type: 'personal',
            name: '광개토대왕',
            nickname: '광개토',
            startTime: 19,
            endTime: 21,
            personnel: 1
        }
    ];

    useEffect(() => {
        //fetchMothlyReserves
        setDate(null);
        const dates = PrevPractices.map(reserve => reserve.date.getDate());
        calcDates(dates);

    }, [calendarMonth])

    useEffect(() => {
        if (!selectedDate) setReserveList(PrevPractices)
        else {
            setReserveList(PrevPractices.filter((reserve) => reserve.date.getDate() == selectedDate.getDate()))
        }
    }, [selectedDate])

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <ScrollView contentContainerStyle={{ backgroundColor: '#FFF' }}>
                <MiniCalendar
                    onSelect={(date) => setDate(date)}
                    selectedDate={selectedDate}
                    setMonth={setMonth}
                    calendarMonth={calendarMonth}
                    reservedDates={reservedDate} />
                <PrevPracticeList
                    prevPractice={reserveList}
                    onPress={(reserve: Reserve) => {
                        const serializedReserve = {
                            ...reserve,
                            date: reserve.date.toISOString(),
                        };
                        navigation.push('PracticeInfo', { reserveInfo: serializedReserve });
                    }} />
            </ScrollView>
        </View>
    )
}

const MiniCalendar: React.FC<{ onSelect: (date: Date | null) => void, selectedDate: Date | null, calendarMonth: Date, setMonth: (date: Date) => void, reservedDates: number[] | null }> = ({ onSelect, selectedDate, setMonth, calendarMonth, reservedDates }) => {

    const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

    const prevDays = (day: number) => {
        if (day == 0) return 6;
        return day - 1;
    }

    const filterLogforDate = (date: number) => {
        const newDate = new Date(calendarMonth);
        newDate.setDate(date);
        onSelect(newDate);
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
        onSelect(null);
    };

    const decrementMonth = () => {
        const newDate = new Date(calendarMonth);
        newDate.setMonth(calendarMonth.getMonth() - 1);
        setMonth(newDate);
        onSelect(null);
    };

    const renderWeeks = () => {
        const weeks: any[] = [];
        let days: any[] = [];

        daysInMonth.forEach((day, index) => {
            if (day == 0) days.push(<View style={{ width: 32, height: 32 }} />)
            else {
                const isReserved = reservedDates?.includes(day);
                days.push(
                    <Pressable key={`date-${day}`}
                        style={{ height: 32, width: 32, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: day == selectedDate?.getDate() ? Color['blue100'] : 'transparent', borderRadius: 5 }}
                        onPress={() => {
                            if (selectedDate?.getDate() == day) onSelect(null);
                            else isReserved && filterLogforDate(day);
                        }}
                    >
                        <Text style={[styles.CalendarText, isReserved && { color: Color['grey600'] }, day == selectedDate?.getDate() && { color: Color['blue600'] }]}>{day}</Text>
                        {isReserved && <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 2 }}>
                            <View style={{ width: 4, height: 4, borderRadius: 20, backgroundColor: Color['blue500'] }} />
                        </View>}
                    </Pressable>
                );
            }

            if ((index + 1) % 7 === 0) {
                weeks.push(
                    <View key={'day' + index} style={{ flexDirection: 'row', marginHorizontal: 48, width: 320, justifyContent: 'space-around' }}>
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


const PrevPracticeList: React.FC<{ prevPractice: Reserve[] | null, onPress: (reserve: Reserve) => void }> = ({ prevPractice, onPress }) => {

    const mapedList = prevPractice?.reduce((acc, reserve) => {
        const dateKey: string = reserve.date.toDateString(); // 날짜를 키로 사용 (YYYY-MM-DD 포맷)

        if (!acc[dateKey]) {
            acc[dateKey] = []; // 해당 날짜에 대한 배열이 없으면 초기화
        }

        acc[dateKey].push(reserve); // 해당 날짜에 예약 추가
        return acc;
    }, {} as Record<string, Reserve[]>);

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <View style={{ flex: 1 }}>
            {mapedList && Object.entries(mapedList).map(([dateKey, reserves]) => {
                const date = new Date(dateKey);

                return (
                    <View key={dateKey}>
                        {/* 날짜 출력 */}
                        <Text style={{ marginVertical: 4, marginHorizontal: 28, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey500'], fontSize: 14 }}>
                            {date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}({daysOfWeek[date.getDay()]})
                        </Text>

                        {/* 해당 날짜의 모든 예약을 출력 */}
                        {reserves.map((reserve, index) => (
                            <View key={dateKey + '-' + index} style={{ marginVertical: 6 }}>
                                <PracticeCard reserve={reserve} onPress={onPress} />
                            </View>
                        ))}
                    </View>
                )
            })}
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
        color: Color['grey300'],
        marginVertical: 2,
    }
})