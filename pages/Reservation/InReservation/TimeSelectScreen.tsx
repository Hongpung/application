import { ActivityIndicator, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Color } from '@hongpung/ColorSet';
import LongButton from '@hongpung/components/buttons/LongButton';
import { useReservation } from '@hongpung/pages/Reservation/context/ReservationContext';
import ShortButton from '@hongpung/components/buttons/ShortButton';
import useFetchUsingToken from '@hongpung/hoc/useFetchUsingToken';
import { Icons } from '@hongpung/components/common/Icon';
import { InReservationStackParamList } from '@hongpung/nav/ReservationStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get(`window`)

interface briefReservation {
    reservationId: number;              // 예약 ID
    creatorName: string;                // 생성자 이름
    date: string;                       // 예약 날짜 (YYYY-MM-DD 형식)
    type: string;                       // 예약 유형
    startTime: string;                  // 시작 시간 (HH:MM:SS 형식)
    endTime: string;                    // 종료 시간 (HH:MM:SS 형식)
    message: string;                    // 예약 메시지
    participationAvailable: boolean;    // 참여 가능 여부
    lastmodified: string;               // 마지막 수정 시간 (ISO 8601 형식)
}
const TimeArray = [
    '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30',
    '22:00'
] as const;

type TimeFormat = typeof TimeArray[number];

interface ExistReservation {
    reservationId: number;
    creator: string;
    startTime: TimeFormat;
    endTime: TimeFormat;
    title: string;
    reservationType: 'REGULAR' | 'COMMON' | 'EXTERNAL';
}

type TimeSelcectNavProps = NativeStackNavigationProp<InReservationStackParamList, 'TimeSelect'>

const TimeSelectScreen: React.FC = () => {

    const navigation = useNavigation<TimeSelcectNavProps>();

    const { reservation, setDate: reservationSetDate, setTime } = useReservation();

    const [selectedTimeBlocks, setTimeBlocks] = useState<string[]>([]);
    const [alertVisible, setAlertVisible] = useState(false);

    const TimesRef = useRef<ScrollView>(null);


    const times = [
        'TIME_1000', 'TIME_1030', 'TIME_1100', 'TIME_1130',
        'TIME_1200', 'TIME_1230', 'TIME_1300', 'TIME_1330',
        'TIME_1400', 'TIME_1430', 'TIME_1500', 'TIME_1530',
        'TIME_1600', 'TIME_1630', 'TIME_1700', 'TIME_1730',
        'TIME_1800', 'TIME_1830', 'TIME_1900', 'TIME_1930',
        'TIME_2000', 'TIME_2030', 'TIME_2100', 'TIME_2130',
        'TIME_2200'];

    const [occupiedTimes, setOccupiedTimes] = useState<string[]>([])

    const renderWeekOfDate = useCallback((selectedDate: Date) => {
        const day = selectedDate.getDay() == 0 ? 7 : selectedDate.getDay();
        const week = [];
        const startDate = new Date(selectedDate);
        const today = new Date()
        startDate.setDate(selectedDate.getDate() - day + 1);

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            week.push(
                <Pressable
                    key={`${currentDate}`}
                    onPress={() => { currentDate > new Date(today.getTime() + 13 * 60 * 60 * 1000) && reservationSetDate(currentDate) }}
                    style={[{ width: 28, height: 28, borderRadius: 5, justifyContent: 'center' }, selectedDate.getDate() == currentDate.getDate() && { backgroundColor: Color['blue100'] }]}
                >
                    <Text style={[styles.Date, (currentDate <= new Date(today.getTime() + 13 * 60 * 60 * 1000)) && { color: Color['grey300'] }]}>{currentDate.getDate()}</Text>
                </Pressable>
            )
        }
        // TimesRef.current?.scrollTo({ y: 0, animated: false })
        return week;

    }, [reservation])

    useEffect(() => {
        if (reservation.date) {
            setTimeBlocks([]);
        }
    }, [reservation.date])
    const formatTime = useCallback((hour: number): string => {
        let period = "AM";
        let formattedHour = hour;

        if (hour === 0) {
            // 0시는 AM12로 변환
            formattedHour = 12;
        } else if (hour === 12) {
            // 12시는 PM12로 변환
            period = "PM";
        } else if (hour > 12) {
            // 13시 이상은 PM으로 변환하고 12를 뺌
            period = "PM";
            formattedHour = hour - 12;
        }

        // 두 자리 숫자로 변환
        const formattedHourStr = formattedHour.toString().padStart(2, "0");

        return `${period}${formattedHourStr}`;
    }, [])

    // const parseTime = useCallback((time: string): number => {
    //     const period = time.slice(0, 2);
    //     let hour = Number(time.slice(2));

    //     if (period === "PM" && hour !== 12) {
    //         hour += 12;
    //     } else if (period === "AM" && hour === 12) {
    //         hour = 0;
    //     }

    //     return hour;
    // }, [])

    useEffect(() => {
        {
            const { startTime, endTime } = reservation.Time;
            if (startTime.length > 0 && endTime.length > 0) {
                const startIdx = times.indexOf(startTime);
                const endIdx = times.indexOf(endTime);

                if (startIdx != -1 && endIdx != -1) {
                    const loadedTimes = times.slice(startIdx, endIdx);
                    setTimeBlocks(loadedTimes);
                }
            }
        }
    }, [])

    const confirmButtonText = useCallback(() => {
        if (selectedTimeBlocks && selectedTimeBlocks.length > 0) {
            const startTimeText = selectedTimeBlocks[0].toString();
            const endTimeText = times[times.indexOf(selectedTimeBlocks[selectedTimeBlocks.length - 1]) + 1];
            return `${startTimeText.slice(5, 7)}:${startTimeText.slice(7)} ~ ${endTimeText.toString().slice(5, 7)}:${endTimeText.toString().slice(7)} 예약`;
        }
        return ''
    }, [selectedTimeBlocks])


    const { data, loading, error } = useFetchUsingToken<ExistReservation[]>(
        reservation.date ? `${process.env.EXPO_PUBLIC_BASE_URL}/reservation/daily/occupied?date=${reservation.date.toISOString().split('T')[0]}` : null,
        {
        }, 2000, [reservation.date]
    )
    console.log(data)

    const parsedTimeRange = (reservation: ExistReservation) => {
        const [startHour, startMinnute] = reservation.startTime.split(':')
        const [endHour, endMinnute] = reservation.endTime.split(':')
        return [`TIME_${startHour}${startMinnute}`, `TIME_${endHour}${endMinnute}`]
    }

    useEffect(() => {
        if (data) {
            const occupied: string[] = [];
            data.forEach(reservationData => {
                console.log(reservation.reservationId, reservationData.reservationId)
                if (reservationData.reservationId == reservation.reservationId) return;
                const [startTime, endTime] = parsedTimeRange(reservationData);
                for (let i = times.indexOf(startTime); i < times.indexOf(endTime); i++)
                    occupied.push(times[i]);
            });

            // 이전 값과 비교하여 업데이트
            if (JSON.stringify(occupied) !== JSON.stringify(occupiedTimes)) {
                setOccupiedTimes(occupied);
            }
        }
    }, [data, occupiedTimes]);

    const toggleTime = useCallback((time: string) => {
        // selectedTimes를 정렬된 상태로 유지
        //if (selectedTimeBlocks.length == 0) return;
        const lateTimes = selectedTimeBlocks.sort((a, b) => times.indexOf(a) - times.indexOf(b)) ?? [];

        const timeIndex = times.indexOf(time);
        const firstSelectedTimeIndex = times.indexOf(lateTimes[0]);
        const lastSelectedTimeIndex = times.indexOf(lateTimes[lateTimes.length - 1]);

        if (!lateTimes.includes(time)) {
            if (lateTimes.length === 0) {
                lateTimes.push(time);
                setTimeBlocks([...lateTimes]);
            } else if (timeIndex === firstSelectedTimeIndex - 1 || timeIndex === lastSelectedTimeIndex + 1) {
                lateTimes.push(time);
                setTimeBlocks([...lateTimes]);
            } else {
                const startIndex = Math.min(timeIndex, firstSelectedTimeIndex);
                const endIndex = Math.max(timeIndex, lastSelectedTimeIndex);
                const newTimes = times.slice(startIndex, endIndex + 1);
                const contaionOccupies = newTimes.filter(newTime => occupiedTimes.includes(newTime))
                if (contaionOccupies.length > 0 && contaionOccupies) {
                    if (firstSelectedTimeIndex != startIndex) {
                        //시작점을 바꿀 경우 이미 먹힌 시간은 못먹게 해야함
                        //중첩되는 occupideTime을 가져와야듯
                        const lastOccupiedIndex = times.indexOf(contaionOccupies[contaionOccupies.length - 1]) + 1;
                        const newTimes = times.slice(lastOccupiedIndex, endIndex + 1);
                        setTimeBlocks([...newTimes]);
                    } else if (lastSelectedTimeIndex != endIndex) {
                        const firstOccupiedIndex = times.indexOf(contaionOccupies[0]!) - 1;
                        const newTimes = times.slice(startIndex, firstOccupiedIndex + 1);
                        setTimeBlocks([...newTimes]);
                    }
                }
                else
                    setTimeBlocks([...newTimes]);
            }
        } else {
            const index = lateTimes.indexOf(time);
            if (index > -1) {
                if ((index === 0 && timeIndex === firstSelectedTimeIndex) || (index === lateTimes.length - 1 && timeIndex === lastSelectedTimeIndex)) {
                    lateTimes.splice(index, 1);
                    setTimeBlocks([...lateTimes]);
                }
            }
        }
    }, [selectedTimeBlocks, times]);

    const incrementMonth = () => {
        if (!reservation.date) return;
        const nextMonth = new Date(reservation.date);
        nextMonth.setMonth(reservation.date.getMonth() + 1);
        reservationSetDate(nextMonth);
    };

    const decrementMonth = () => {

        if (!reservation.date) return;
        const prevMonth = new Date(reservation.date);
        prevMonth.setMonth(reservation.date.getMonth() - 1);
        reservationSetDate(prevMonth);
    };

    const prevWeek = () => {
        if (!reservation.date) return;
        const lastDay = new Date(reservation.date)
        lastDay.setDate(reservation.date.getDate() - 7);
        const today = new Date()
        if (lastDay <= today)
            lastDay.setDate(today.getDate() + 1);
        reservationSetDate(lastDay);
    }

    const nextWeek = () => {
        if (!reservation.date) return;
        const nextDay = new Date(reservation.date)
        nextDay.setDate(reservation.date.getDate() + 7);
        reservationSetDate(nextDay);
    }

    if (!reservation.date || !reservation.Time || !data)
        return (
            <View></View>
        )

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
                <Pressable onPress={() => { navigation.navigate('ResrvationDateSelect'); }} style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, left: 22, width: 28, height: 28 }}>
                    <Icons name='arrow-back' size={24} color={Color['blue500']} />
                </Pressable>
                <View style={styles.MonthRow}>
                    <Pressable style={styles.MonthBtn}
                        onPress={decrementMonth}>
                        <Icons size={24} name={'caret-back'} color={Color['grey300']} />
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            navigation.navigate('ResrvationDateSelect');
                        }}>
                        <Text style={styles.MonthNumber}>
                            {`${reservation.date.getMonth() + 1}월`}
                        </Text>
                    </Pressable>

                    <Pressable style={styles.MonthBtn}
                        onPress={incrementMonth} >
                        <Icons size={24} name={'caret-forward'} color={Color['grey300']} />
                    </Pressable>
                </View>
            </View>
            <View style={{ height: 60, marginHorizontal: 32, width: width - 64, alignItems: 'center' }}>
                <View style={{ height: 4 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 264 }}>
                    <Text style={styles.DayText}>월</Text>
                    <Text style={styles.DayText}>화</Text>
                    <Text style={styles.DayText}>수</Text>
                    <Text style={styles.DayText}>목</Text>
                    <Text style={styles.DayText}>금</Text>
                    <Text style={styles.DayText}>토</Text>
                    <Text style={styles.DayText}>일</Text>
                </View>
                <View style={{ height: 4 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Pressable style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32, width: 32, }} onPress={prevWeek} >
                        <Icons size={24} name={'chevron-back'} color={Color['blue500']} />
                    </Pressable>
                    <View style={{ height: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 264, marginHorizontal: 8 }}>
                        {renderWeekOfDate(reservation.date)}
                    </View>
                    <Pressable style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32, width: 32, }} onPress={nextWeek} >
                        <Icons size={24} name={'chevron-forward'} color={Color['blue500']} />
                    </Pressable>
                </View>
            </View>
            <View style={{ height: 20 }} />
            <ScrollView ref={TimesRef}>
                {Array.from({ length: 13 }, (_, index) => (index + 10)).map((time, index) => {
                    return (
                        <View key={time + index}
                            pointerEvents="none"
                        >
                            <View style={{ flexDirection: 'row', marginHorizontal: 24, alignItems: 'center', height: 24, justifyContent: 'center' }}>
                                <View>
                                    <View style={[{ position: 'absolute', height: 9.2, width: 56, top: 0, }, (selectedTimeBlocks.includes(`TIME_${time - 1}30`)) ? { backgroundColor: Color['blue100'], zIndex: 2 } : occupiedTimes.includes(`TIME_${time - 1}30`) ? { backgroundColor: Color['grey200'], zIndex: 2 } : { backgroundColor: '#FFF', zIndex: 0 },]} />
                                    <View style={[{ position: 'absolute', height: 12, width: 56, top: 7.2, }, (selectedTimeBlocks.includes(`TIME_${time}00`)) ? { backgroundColor: Color['blue100'], zIndex: 2 } : occupiedTimes.includes(`TIME_${time}00`) ? { backgroundColor: Color['grey200'], zIndex: 2 } : { backgroundColor: '#FFF', zIndex: 0 },]} />
                                    <Text
                                        style={[
                                            { zIndex: 2, alignSelf: 'center', fontSize: 16, width: 56, textAlign: 'center', color: Color['grey300'], fontFamily: 'NanumSquareNeo-Regular' },
                                            (selectedTimeBlocks.includes(`TIME_${time}00`) || selectedTimeBlocks.includes(`TIME_${time - 1}30`)) && { color: Color['blue500'] }
                                        ]}
                                    >
                                        {formatTime(time)}
                                    </Text>
                                </View>

                            </View>
                            {index < times.length - 1 && <View style={{ height: 56 }} />}

                        </View>
                    );
                })}

                <View style={{ position: 'absolute', flex: 1, top: 11, bottom: 12, zIndex: -1 }}>
                    {
                        times.map((time, index) => {
                            if (index == times.length - 1) return null;
                            return (
                                <Pressable
                                    key={time + '_pressable'} // 고유한 key를 부여
                                    style={[
                                        { position: 'relative', display: 'flex', height: 42, borderWidth: 2, borderColor: Color['grey200'], marginHorizontal: 24, width: width - 48, borderStyle: 'dotted', backgroundColor: occupiedTimes.includes(time) ? Color['grey200'] : '#FFF', zIndex: index },
                                        index != 0 && { top: -index * 2, height: 42 }, selectedTimeBlocks.includes(time) && { borderColor: Color['blue500'], backgroundColor: Color['blue100'], zIndex: index + 2 }
                                    ]}
                                    onPress={() => { if (!occupiedTimes.includes(time)) toggleTime(time) }}>
                                    {/* { <View style={{ position: 'absolute', backgroundColor: Color['grey200'], height: 42, width: '100%', left: 20, top: -2, }}></View>} */}
                                </Pressable>
                            );
                        })
                    }
                </View>
            </ScrollView>

            <View style={{ height: 20 }} />
            {selectedTimeBlocks.length != 0 && <View>
                <LongButton color='blue' innerText={confirmButtonText()}
                    isAble={true}
                    onPress={() => {
                        const overlappingTimes = occupiedTimes.filter(time => selectedTimeBlocks.includes(time));

                        if (overlappingTimes.length > 0) {
                            setAlertVisible(true)
                        } else {
                            setTime((selectedTimeBlocks[0]), (times[times.indexOf(selectedTimeBlocks[selectedTimeBlocks.length - 1]) + 1]))
                            navigation.navigate('inReservation');
                            // setHasWait(false);
                        }

                    }} />
            </View>}
            <Modal visible={alertVisible} transparent>
                <Pressable style={{ backgroundColor: 'rgba(0,0,0,0.4)', flex: 1, justifyContent: 'center' }} onPress={() => setAlertVisible(false)}>
                    <Pressable style={{ marginHorizontal: 28, height: 200, backgroundColor: '#FFF', borderRadius: 15 }} onPress={(e) => e.stopPropagation()} >
                        <Text style={alertStyle.Header}>중복 알림</Text>
                        <Text style={alertStyle.Script}>{`이미 있는 예약과 중복이 발생하여\n대기 순번으로 밀리게 돼요.`}</Text>
                        <View style={{ position: 'absolute', flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 8, width: width - 56 - 16, bottom: 16 }}>
                            <ShortButton color='red' innerText='취소' isFilled={true} onPress={() => { setAlertVisible(false) }} />
                            <ShortButton color='blue' innerText='대기 진행' isFilled={true} onPress={() => {
                                setTime((selectedTimeBlocks[0]), (times[times.indexOf(selectedTimeBlocks[selectedTimeBlocks.length - 1]) + 1]))
                                navigation.navigate('inReservation');
                                // setHasWait(true)
                            }} />
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
            <Modal visible={loading} transparent>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <ActivityIndicator size={'large'} color={'#FFF'} />
                </View>
            </Modal>
        </View>
    )
}

export default TimeSelectScreen

const alertStyle = StyleSheet.create({
    Header: {
        fontFamily: 'NanumSquareNeo-Bold',
        fontSize: 22,
        left: 20,
        top: 20
    },
    Script: {
        fontFamily: 'NanumSquareNeo-Regular',
        fontSize: 16,
        left: 24,
        top: 38,
        lineHeight: 22,
        width: width - 108
    }
})

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
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
    },
})