import { ActivityIndicator, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';

import useFetchUsingToken from '@hongpung/src/common/hooks/useFetchUsingToken';
import { Color } from '@hongpung/ColorSet';
import { Icons } from '@hongpung/src/common/components/icons/Icon';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ReservationStackParamList } from '@hongpung/nav/ReservationStack';

const { width } = Dimensions.get(`window`)

interface DailyReservation {
    amountOfParticipators: number;
    reservationId: number;
    creatorName: string;
    creatorNickname: string;
    date: string;
    startTime: string;
    endTime: string;
    title: string;
    reservationType: reservationType;
    participationAvailable: boolean;
}

type reservationType = 'COMMON' | 'REGULAR' | 'EXTERNAL'

const times = ['AM10', 'AM11', 'PM12', 'PM01', 'PM02', 'PM03', 'PM04', 'PM05', 'PM06', 'PM07', 'PM08', 'PM09', 'PM10']
type DailyReserveProps = NativeStackScreenProps<ReservationStackParamList, 'DailyReserveList'>

const DailyReservationListScreen: React.FC<DailyReserveProps> = ({ navigation, route }) => {

    const isFocusing = useIsFocused();
    const today = useMemo(() => new Date(), [])
    const { date } = route.params

    const [selectedDate, setDate] = useState(new Date(date.split('T')[0]))

    const TimesRef = useRef<any>(null)

    useEffect(() => { if (date != null) setDate(new Date(date)) }, [])
    useEffect(() => { TimesRef.current?.scrollTo({ y: 0, animated: false }) }, [selectedDate])

    const { data, loading, error } = useFetchUsingToken<DailyReservation[]>(
        `${process.env.EXPO_PUBLIC_BASE_URL}/reservation/daily?date=${selectedDate.toISOString().split('T')[0]}`,
        {
        }, 2000, [selectedDate, isFocusing]
    )

    console.log(selectedDate.toISOString().split('T')[0], ':', data)

    // if (loading)
    //     return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
    //         <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)' }}></View>
    //         <ActivityIndicator size={'large'} color={'#FFF'} />
    //     </View>)

    // if (error) {
    //     return (
    //         <View>
    //             <Text>Error: {error}</Text>
    //         </View>
    //     );
    // }

    const calculateWeekOfDate = useCallback((selectedDate: Date) => {
        const day = selectedDate.getDay() == 0 ? 7 : selectedDate.getDay();
        const week = [];
        const startDate = new Date(selectedDate);
        startDate.setDate(selectedDate.getDate() - day + 1);

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            week.push(
                currentDate
            )
        }
        return week;
    }, [])

    const incrementMonth = () => {
        const nextMonth = new Date(selectedDate);
        nextMonth.setMonth(selectedDate.getMonth() + 1);
        setDate(nextMonth);
    };

    const decrementMonth = () => {
        const prevMonth = new Date(selectedDate);
        prevMonth.setMonth(selectedDate.getMonth() - 1);
        setDate(prevMonth);
    };

    const prevWeek = () => {
        const lastDay = new Date(selectedDate)
        lastDay.setDate(selectedDate.getDate() - 7);
        setDate(lastDay);
    }

    const nextWeek = () => {
        const nextDay = new Date(selectedDate)
        nextDay.setDate(selectedDate.getDate() + 7);
        setDate(nextDay);
    }

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <View style={{
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFF',
                paddingHorizontal: 24
            }}>
                <Pressable onPress={() => { navigation.navigate('ReserveCalendar', { date: selectedDate.toString() }); }} style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, left: 22, width: 28, height: 28 }}>
                    <Icons size={24} name={'arrow-back'} color={Color['blue500']} />
                </Pressable>
                <View style={styles.MonthRow}>
                    <Pressable style={styles.MonthBtn}
                        onPress={decrementMonth}>
                        <Icons size={24} name={'caret-back'} color={Color['grey300']} />
                    </Pressable>

                    <Text style={styles.MonthNumber}>
                        {`${selectedDate.getMonth() + 1}월`}
                    </Text>
                    <Pressable style={styles.MonthBtn}
                        onPress={incrementMonth} >
                        <Icons size={24} name={'caret-forward'} color={Color['grey300']} />
                    </Pressable>
                </View>
                {(selectedDate > new Date(today.getTime() + 13 * 60 * 60 * 1000)) &&
                    <Pressable
                        onPress={() => {
                            navigation.navigate('ReservationStack', { screen: 'inReservation', params: { date: selectedDate.toISOString().split('T')[0], reservationId: null } });
                        }} style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, right: 22, height: 28 }}>
                        <Text style={{
                            fontFamily: "NanumSquareNeo-Bold", color: Color['blue500'],
                            fontSize: 18,
                            textAlign: 'right',
                            textAlignVertical: 'center'
                        }}>{'추가'}</Text>
                    </Pressable>
                }
            </View>
            <View style={{ height: 60, marginHorizontal: 32, alignItems: 'center' }}>
                <View style={{ paddingVertical: 4 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                        <Text key={'mon'} style={styles.DayText}>월</Text>
                        <Text key={'tue'} style={styles.DayText}>화</Text>
                        <Text key={'wed'} style={styles.DayText}>수</Text>
                        <Text key={'thu'} style={styles.DayText}>목</Text>
                        <Text key={'fri'} style={styles.DayText}>금</Text>
                        <Text key={'sat'} style={styles.DayText}>토</Text>
                        <Text key={'sun'} style={styles.DayText}>일</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Pressable style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32, width: 32, }} onPress={prevWeek} >
                        <Icons size={24} name={'chevron-back'} color={Color['blue500']} />
                    </Pressable>
                    <View style={{ height: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginHorizontal: 8 }}>
                        {calculateWeekOfDate(selectedDate).map(currentDate => (
                            <Pressable key={`${currentDate}`}
                                style={[{ width: 28, height: 28, borderRadius: 5, justifyContent: 'center' }, selectedDate.getDate() == currentDate.getDate() && { backgroundColor: Color['blue100'] }]}
                                onPress={() => setDate(currentDate)}
                            >
                                <Text style={[styles.Date, selectedDate.getDate() == currentDate.getDate() && { color: Color['blue600'] }, (currentDate <= new Date(today.getTime() + 13 * 60 * 60 * 1000)) && { color: Color['grey300'] }]}>{currentDate.getDate()}</Text>
                            </Pressable>
                        ))}
                    </View>
                    <Pressable style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32, width: 32, }} onPress={nextWeek} >
                        <Icons size={24} name={'chevron-forward'} color={Color['blue500']} />
                    </Pressable>
                </View>
            </View>
            <View style={{ height: 20 }} />
            <ScrollView ref={TimesRef}>
                {times.map((time, index) => {
                    return (
                        <>
                            <View key={time} style={{ flexDirection: 'row', marginHorizontal: 24, alignItems: 'center', height: 24 }}>
                                <View style={{ height: 1, backgroundColor: Color.grey200, width: (width - 48) / 2 - 28, overflow: 'visible' }} />
                                <Text style={{ alignSelf: 'center', fontSize: 16, width: 56, textAlign: 'center', color: Color[`grey300`], fontFamily: 'NanumSquareNeo-Regular' }}>{time}</Text>
                                <View style={{ height: 1, backgroundColor: Color.grey200, width: (width - 48) / 2 - 28, overflow: 'visible' }} />
                            </View>
                            {index < times.length - 1 &&
                                <View key={time + 'under'} style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ height: 0, borderWidth: 1, borderStyle: 'dotted', borderColor: Color[`grey100`], width: (width - 48) }} />
                                </View>
                            }
                        </>)
                })}

                {data?.length! > 0 && data?.map((reservation) => {
                    const [startHour, startMinnute] = reservation.startTime.split(':').map((time: string) => Number(time))
                    const [endHour, endMinnute] = reservation.endTime.split(':').map((time: string) => Number(time))

                    const Timegap = endHour * 60 - startHour * 60 + endMinnute - startMinnute
                    const reserveTop = 12 + (Number(startHour) - 10) * 80 + (startMinnute > 0 ? 40 : 0);
                    const reserveHeight = 40 * (Timegap / 30);
                    const color = reservation.reservationType === 'EXTERNAL' ? Color['grey300'] : reservation.reservationType == 'REGULAR' ? Color['blue500'] : reservation.participationAvailable ? Color['green500'] : Color['red500'];
                    return (
                        <Pressable key={'rid' + reservation.reservationId} style={{ position: 'absolute', top: reserveTop, width: width - 72, height: reserveHeight, borderRadius: 10, borderWidth: 2, borderColor: color, backgroundColor: '#FFF', marginHorizontal: 36, overflow: 'hidden' }}
                            onPress={() => { navigation.navigate('ReservationDetail', { reservationId: reservation.reservationId }) }}>
                            <Text numberOfLines={1} style={{ position: 'absolute', width: width / 2, top: Timegap > 30 ? 16 : 8, left: 16, fontSize: 18, fontFamily: 'NanumSquareNeo-Bold' }}>{reservation.title}</Text>

                            {Timegap > 30 &&
                                <View style={{ position: 'absolute', bottom: 12, flexDirection: 'row', width: '100%', paddingHorizontal: 12, gap: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                                    {reservation.reservationType === 'EXTERNAL' ?
                                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], paddingHorizontal: 4 }}>
                                            외부 예약
                                        </Text>
                                        :
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                            <Icons size={24} name={'people'} color={Color['grey300']} />
                                            <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], }}>{reservation.amountOfParticipators}</Text>
                                        </View>}

                                    {Timegap > 60 && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                        <Icons size={24} name={'time-outline'} color={Color['grey300']} />
                                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], }}>{reservation.startTime}~{reservation.endTime}</Text>
                                    </View>}

                                </View>
                            }
                            {reservation.reservationType == 'REGULAR' ?
                                Timegap > 30 &&
                                <View style={{ position: 'absolute', top: -4, right: 8, }} >
                                    <Icons size={48} name={'bookmark-sharp'} color={Color['blue500']} />
                                </View>
                                :
                                <View style={{ position: 'absolute', top: 10, right: 14, paddingVertical: 4, gap: 2, alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                                    <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700'] }}>{reservation.creatorName}</Text>
                                    {reservation.creatorNickname && <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>{reservation.creatorNickname}</Text>}
                                </View>
                            }
                        </Pressable>
                    )
                })}
            </ScrollView>

            <Modal visible={loading} transparent>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',}}>
                    <ActivityIndicator size={'large'} color={Color['blue500']} />
                </View>
            </Modal>
            <View style={{ height: 20 }} />
        </View>
    )
}

export default DailyReservationListScreen

const styles = StyleSheet.create({
    DayText: {
        width: 28,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'NanumSquareNeo-Bold',
        color: Color['grey500'],
    },
    Date: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'NanumSquareNeo-Bold',
        borderRadius: 5,
        color: Color['grey500'],
    }, MonthRow: {
        gap: 8,
        height: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    MonthNumber: {
        width: 44,
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
})