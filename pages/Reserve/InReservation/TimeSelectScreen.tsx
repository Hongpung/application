import { ActivityIndicator, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Color } from '@hongpung/ColorSet';
import LongButton from '@hongpung/components/buttons/LongButton';
import { useReservation } from '@hongpung/pages/Reserve/context/ReservationContext';
import ShortButton from '@hongpung/components/buttons/ShortButton';
import useFetchUsingToken from '@hongpung/hoc/useFetchUsingToken';
import { Icons } from '@hongpung/components/Icon';
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


type TimeSelcectNavProps = NativeStackNavigationProp<InReservationStackParamList, 'TimeSelect'>

const TimeSelectScreen: React.FC = () => {

    const navigation = useNavigation<TimeSelcectNavProps>();

    const { reservation, setDate, setTime, setHasWait } = useReservation();
    const TimesRef = useRef<any>(null);
    const { date, Time } = reservation;
    const [selectedTimeBlocks, setTimeBlocks] = useState<string[]>([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const today = new Date()

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
        startDate.setDate(selectedDate.getDate() - day + 1);

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            week.push(
                <Pressable key={`${currentDate}`} onPress={() => { currentDate > today && setDate(currentDate) }} style={[{ width: 28, height: 28, borderRadius: 5, justifyContent: 'center' }, selectedDate.getDate() == currentDate.getDate() && { backgroundColor: Color['blue100'] }]}>
                    <Text style={[styles.Date, (currentDate <= today) && { color: Color['grey300'] }]}>{currentDate.getDate()}</Text>
                </Pressable>
            )
        }


        TimesRef.current?.scrollTo({ y: 0, animated: false })

        return week;
    }, [date])

    useEffect(() => setTimeBlocks([]), [date])
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
        const { startTime, endTime } = Time;
        if (startTime && endTime) {
            const startIdx = times.indexOf(startTime);
            const endIdx = times.indexOf(endTime);

            if (startIdx != -1 && endIdx != -1) {
                const loadedTimes = times.slice(startIdx, endIdx);
                setTimeBlocks(loadedTimes);
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


    const { data, loading, error } = useFetchUsingToken<briefReservation[]>(
        date ? `${process.env.BASE_URL}/reservation/day?date=${date?.toISOString().split('T')[0]}` : null,
        {
        }, 2000, [date]
    )


    const parsedTimeRange = (reservation: briefReservation) => {
        const [startHour, startMinnute] = reservation.startTime.split(':')
        const [endHour, endMinnute] = reservation.endTime.split(':')

        return [`TIME_${startHour}${startMinnute}`, `TIME_${endHour}${endMinnute}`]
    }

    useEffect(() => {
        const occupied: string[] = [];

        data?.forEach(reserve => {
            if (reserve.reservationId == reservation.reservationId) return;
            const [startTime, endTime] = parsedTimeRange(reserve);
            for (let i = times.indexOf(startTime); i < times.indexOf(endTime); i++)
                occupied.push(times[i])
        }
        )
        setOccupiedTimes(occupied);
    }, [data])

    const toggleTime = useCallback((time: string) => {
        // selectedTimes를 정렬된 상태로 유지
        //if (selectedTimeBlocks.length == 0) return;
        const lastTimes = selectedTimeBlocks?.sort((a, b) => times.indexOf(a) - times.indexOf(b)) ?? [];

        const timeIndex = times.indexOf(time);
        const firstSelectedTimeIndex = times.indexOf(lastTimes[0]);
        const lastSelectedTimeIndex = times.indexOf(lastTimes[lastTimes.length - 1]);

        if (!lastTimes.includes(time)) {
            if (lastTimes.length === 0) {
                lastTimes.push(time);
                setTimeBlocks([...lastTimes]);
            } else if (timeIndex === firstSelectedTimeIndex - 1 || timeIndex === lastSelectedTimeIndex + 1) {
                lastTimes.push(time);
                setTimeBlocks([...lastTimes]);
            } else {
                const startIndex = Math.min(timeIndex, firstSelectedTimeIndex);
                const endIndex = Math.max(timeIndex, lastSelectedTimeIndex);
                const newTimes = times.slice(startIndex, endIndex + 1);

                setTimeBlocks([...newTimes]);
            }
        } else {
            const index = lastTimes.indexOf(time);
            if (index > -1) {
                if ((index === 0 && timeIndex === firstSelectedTimeIndex) || (index === lastTimes.length - 1 && timeIndex === lastSelectedTimeIndex)) {
                    lastTimes.splice(index, 1);
                    setTimeBlocks([...lastTimes]);
                }
            }
        }
    }, [selectedTimeBlocks, times]);

    const incrementMonth = () => {
        const nextMonth = new Date(date!);
        nextMonth.setMonth(date!.getMonth() + 1);
        setDate(nextMonth);
    };

    const decrementMonth = () => {
        const prevMonth = new Date(date!);
        prevMonth.setMonth(date!.getMonth() - 1);
        setDate(prevMonth);
    };

    const prevWeek = () => {
        const lastDay = new Date(date!)
        lastDay.setDate(date!.getDate() - 7);
        if (lastDay <= today)
            lastDay.setDate(today.getDate() + 1);
        setDate(lastDay);
    }

    const nextWeek = () => {
        const nextDay = new Date(date!)
        nextDay.setDate(date!.getDate() + 7);
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
                            // navigation.navigate('ResrvationDateSelect');
                        }}>
                        <Text style={styles.MonthNumber}>
                            {`${date!.getMonth() + 1}월`}
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
                        {renderWeekOfDate(date!)}
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
                                    <View style={[{ position: 'absolute', height: 9.2, width: 56, top: 0, }, (selectedTimeBlocks?.includes(`TIME_${time - 1}30`)) ? { backgroundColor: Color['blue100'], zIndex: 2 } : { backgroundColor: '#FFF', zIndex: 0 },]} />
                                    <View style={[{ position: 'absolute', height: 12, width: 56, top: 7.2, }, (selectedTimeBlocks?.includes(`TIME_${time}00`)) ? { backgroundColor: Color['blue100'], zIndex: 2 } : { backgroundColor: '#FFF', zIndex: 0 },]} />
                                    <Text
                                        style={[
                                            { zIndex: 2, alignSelf: 'center', fontSize: 16, width: 56, textAlign: 'center', color: Color['grey300'], fontFamily: 'NanumSquareNeo-Regular' },
                                            (selectedTimeBlocks?.includes(`TIME_${time}00`) || selectedTimeBlocks?.includes(`TIME_${time - 1}30`)) && { color: Color['blue500'] }
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
                                        { position: 'relative', display: 'flex', height: 42, borderWidth: 2, borderColor: Color['grey200'], marginHorizontal: 24, width: width - 48, borderStyle: 'dotted', backgroundColor: '#FFF', zIndex: index },
                                        index != 0 && { top: -index * 2, height: 42 }, selectedTimeBlocks?.includes(time) && { borderColor: Color['blue500'], backgroundColor: Color['blue100'], zIndex: index + 2 }
                                    ]}
                                    onPress={() => toggleTime(time)}>
                                    {occupiedTimes.includes(time) && <View style={{ position: 'absolute', backgroundColor: Color['grey200'], height: 42, width: 100, left: 20, top: -2, }}></View>}
                                </Pressable>
                            );
                        })
                    }
                </View>
            </ScrollView>

            <View style={{ height: 20 }} />
            {selectedTimeBlocks && selectedTimeBlocks?.length != 0 && <View>
                <LongButton color='blue' innerText={confirmButtonText()}
                    isAble={true}
                    onPress={() => {
                        const overlappingTimes = occupiedTimes.filter(time => selectedTimeBlocks.includes(time));

                        if (overlappingTimes.length > 0) {
                            setAlertVisible(true)
                        } else {
                            setTime((selectedTimeBlocks[0]), (times[times.indexOf(selectedTimeBlocks[selectedTimeBlocks.length - 1]) + 1]))
                            navigation.navigate('inReservation');
                            setHasWait(false);
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
                                setTime((selectedTimeBlocks![0]), (times[times.indexOf(selectedTimeBlocks![selectedTimeBlocks!.length - 1]) + 1]))
                                navigation.navigate('inReservation');
                                setHasWait(true)
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