import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Color } from '@hongpung/ColorSet'
import PracticeCard from '@hongpung/components/cards/PracticeCard'
import { Club, clubToEng } from '@hongpung/UserType'
import { Icons } from '@hongpung/components/common/Icon'
import useFetchUsingToken from '@hongpung/hoc/useFetchUsingToken'
import { useRecoilValue } from 'recoil'
import { loginUserState } from '@hongpung/recoil/authState'
import { ReservationDTO } from '@hongpung/pages/Reserve/ReservationInterface'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MyClubStackStackParamList } from '@hongpung/nav/MyClubStack'
import { useNavigation } from '@react-navigation/native'
import ReservationCard from '@hongpung/components/cards/ReservationCard'

export type ReserveType = 'regular' | 'personal' | 'none';


const ClubPracticeCalendarScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

    const [selectedDate, setDate] = useState<Date | null>(null)
    const [reserveList, setReserveList] = useState<ReservationDTO[] | null>(null)
    const [calendarMonth, setMonth] = useState(new Date())
    const [reservedDate, setReservedDates] = useState<{ [key: number]: { regularType: string, isParticipable: boolean }[] }>([]);
    const userInfo = useRecoilValue(loginUserState);

    const { data, loading, error } = useFetchUsingToken<ReservationDTO[]>(
        `${process.env.BASE_URL}/reservation/year-month-member?year=${calendarMonth.getFullYear()}&month=${Number(calendarMonth.getMonth()) + 1}&memberId=${userInfo?.memberId!}`,
        {},
        5000,
        [userInfo, calendarMonth]
    )

    useEffect(() => {
        //fetchMothlyReserves
        if (!!data) {
            const reservedDates: { [key: number]: any[] } = [];
            data.map((reserve) => {
                const reserveDate = new Date(reserve.date).getDate();
                if (!reservedDates[reserveDate]) reservedDates[reserveDate] = [{ regularType: reserve.type, isParticipable: reserve.participationAvailable }];
                else reservedDates[reserveDate] = [...reservedDates[reserveDate], { regularType: reserve.type, isParticipable: reserve.participationAvailable }];
            })
            setReservedDates(reservedDates);
        }

    }, [calendarMonth, data])

    useEffect(() => {
        if (!!data) {
            if (!selectedDate) setReserveList(data)
            else {
                setReserveList(data.filter((reserve) => new Date(reserve.date).getDate() == selectedDate.getDate()))
            }
            console.log(data);
        }
    }, [selectedDate, data])

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <MiniCalendar
                onSelect={(date) => setDate(date)}
                selectedDate={selectedDate}
                setMonth={setMonth}
                calendarMonth={calendarMonth}
                reservedDates={reservedDate} />
            <ScrollView contentContainerStyle={{ backgroundColor: '#FFF' }}>
                <PrevPracticeList
                    prevPractice={reserveList}
                />
            </ScrollView>
        </View>
    )
}

const MiniCalendar: React.FC<{ onSelect: (date: Date | null) => void, selectedDate: Date | null, calendarMonth: Date, setMonth: (date: Date) => void, reservedDates: { [key: number]: { regularType: string, isParticipable: boolean }[] } }> = ({ onSelect, selectedDate, setMonth, calendarMonth, reservedDates }) => {

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
                const dateReservaData = reservedDates[day];
                days.push(
                    <Pressable key={`date-${day}`}
                        style={{ height: 32, width: 32, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: day == selectedDate?.getDate() ? Color['blue100'] : 'transparent', borderRadius: 5 }}
                        onPress={() => {
                            if (selectedDate?.getDate() == day) onSelect(null);
                            else !!dateReservaData && filterLogforDate(day);
                        }}
                    >
                        <Text style={[styles.CalendarText, !!dateReservaData && { color: Color['grey600'] }, day == selectedDate?.getDate() && { color: Color['blue600'] }]}>{day}</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 2, gap: 2 }}>
                            {!!dateReservaData &&
                                dateReservaData?.map((reserve,index) => (
                                    <View key={index+index} style={{ width: 4, height: 4, borderRadius: 20, backgroundColor: reserve.regularType == '정규연습' ? Color['blue500'] : reserve.isParticipable ? Color['green500'] : Color['red500'] }} />
                                ))
                            }</View>
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
        <View style={{ display: 'flex', flexDirection: 'column' }}>
            <Text style={{ marginLeft: 32, marginBottom: 8, fontSize: 16, color: Color['grey400'], fontFamily: 'NanumSquareNeo-Bold' }}>
                {calendarMonth.getFullYear()}년
            </Text>
            <View style={styles.MonthRow}>
                <Pressable style={styles.MonthBtn}
                    onPress={decrementMonth} >
                    <Icons size={20} name='chevron-back' color={Color['blue500']} />
                </Pressable>
                <Text style={styles.MonthNumber}>
                    {calendarMonth.getMonth() + 1}월
                </Text>
                <Pressable style={styles.MonthBtn}
                    onPress={incrementMonth} >
                    <Icons size={20} name='chevron-forward' color={Color['blue500']} />
                </Pressable>
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


const PrevPracticeList: React.FC<{ prevPractice: ReservationDTO[] | null }> = ({ prevPractice }) => {


    const today = useMemo(() => new Date(), [])
    const mapedList = prevPractice?.reduce((acc, reserve) => {
        const dateKey: string = reserve.date; // 날짜를 키로 사용 (YYYY-MM-DD 포맷)

        if (!acc[dateKey]) {
            acc[dateKey] = []; // 해당 날짜에 대한 배열이 없으면 초기화
        }

        acc[dateKey].push(reserve); // 해당 날짜에 예약 추가
        return acc;
    }, {} as Record<string, ReservationDTO[]>);

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <View style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mapedList && Object.entries(mapedList).map(([dateKey, reserves]) => {
                const date = new Date(dateKey);

                return (
                    <View key={dateKey} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {/* 날짜 출력 */}
                        <Text style={{ marginHorizontal: 28, fontFamily: 'NanumSquareNeo-Bold', color: date < today ? Color['grey300'] : Color['grey500'], fontSize: 14 }}>
                            {date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}({daysOfWeek[date.getDay()]})
                        </Text>

                        {reserves.map((reserve, index) => (
                            <View key={dateKey + '-' + index} style={{ marginVertical: 6 }}>
                                <ReservationCard
                                    reservation={reserve} />
                            </View>
                        ))}
                    </View>
                )
            })}
        </View>
    )
}

export default ClubPracticeCalendarScreen

const styles = StyleSheet.create({
    MonthRow: {
        height: 24,
        marginHorizontal: 32,
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
        color: Color['grey300'],
        marginVertical: 2,
    }
})