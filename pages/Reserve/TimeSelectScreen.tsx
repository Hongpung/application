import { Alert, Dimensions, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Color } from '../../ColorSet';
import LongButton from '../../components/buttons/LongButton';
import { ReservationProvider, useReservation } from '../../context/ReservationContext';
import ShortButton from '../../components/buttons/ShortButton';

const { width } = Dimensions.get(`window`)

const TimeSelectScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { reservation, setDate, setTime, setHasWait } = useReservation();

    const { date, Time } = reservation;
    const [selectedTimeBlocks, setTimeBlocks] = useState<string[] | null>(null);
    const [isWeekCalendar, setWeekCalendar] = useState(true)
    const [alertVisble, setAlertVisible] = useState(false);
    const today = new Date()

    const times = ['AM10', 'AM11', 'PM12', 'PM01', 'PM02', 'PM03', 'PM04', 'PM05', 'PM06', 'PM07', 'PM08', 'PM09', 'PM10'];
    const occupiedTimes = ['AM10', 'AM11', 'PM06', 'PM07', 'PM08']

    const renderWeekOfDate = useCallback((selectedDate: Date) => {
        const day = selectedDate.getDay() == 0 ? 7 : selectedDate.getDay();
        const week = [];
        const startDate = new Date(selectedDate);
        startDate.setDate(selectedDate.getDate() - day + 1);

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            week.push(
                <Pressable key={`${currentDate}`} onPress={() => currentDate >= today && setDate(currentDate)} style={[{ width: 28, height: 28, borderRadius: 5, justifyContent: 'center' }, selectedDate.getDate() == currentDate.getDate() && { backgroundColor: Color['blue100'] }]}>
                    <Text style={[styles.Date, (currentDate <= today) && { color: Color['grey300'] }]}>{currentDate.getDate()}</Text>
                </Pressable>
            )
        }
        return week;
    }, [])

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

    const parseTime = useCallback((time: string): number => {
        const period = time.slice(0, 2);
        let hour = Number(time.slice(2));

        if (period === "PM" && hour !== 12) {
            hour += 12;
        } else if (period === "AM" && hour === 12) {
            hour = 0;
        }

        return hour;
    }, [])

    useEffect(() => {
        const { startTime, endTime } = Time;
        if (startTime && endTime) {
            const startIdx = times.indexOf(formatTime(startTime));
            const endIdx = times.indexOf(formatTime(endTime));

            const loadedTimes = times.slice(startIdx, endIdx);

            setTimeBlocks(loadedTimes);
        }
    }, [])

    const toggleTime = useCallback((time: string) => {
        // selectedTimes를 정렬된 상태로 유지
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
                } else {
                    //제거 불가능 알럿 출력
                }
            }
        }
    }, [selectedTimeBlocks, setTimeBlocks, times]);

    const incrementMonth = () => {
        const nextMonth = new Date(date);
        nextMonth.setMonth(date.getMonth() + 1);
        setDate(nextMonth);
    };

    const decrementMonth = () => {
        const prevMonth = new Date(date);
        prevMonth.setMonth(date.getMonth() - 1);
        setDate(prevMonth);
    };

    const prevWeek = () => {
        const lastDay = new Date(date)
        lastDay.setDate(date.getDate() - 7);
        setDate(lastDay);
    }

    const nextWeek = () => {
        const nextDay = new Date(date)
        nextDay.setDate(date.getDate() + 7);
        setDate(nextDay);
    }

    useEffect(() => {
        // fetch 함수 구현
    }, [date])

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
                <Pressable onPress={() => { navigation.navigate('ResrvationDateSelect', { date: date.toString() }); }} style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, left: 22, width: 28, height: 28, backgroundColor: Color['grey300'] }}>
                    <Text style={{
                        fontFamily: "NanumSquareNeo-Bold",
                        height: 24,
                        color: Color['blue500'],
                        fontSize: 18,
                        textAlign: 'right',
                        textAlignVertical: 'center'
                    }}>{'<-'}</Text>
                </Pressable>
                <View style={styles.MonthRow}>
                    <Pressable style={styles.MonthBtn}
                        onPress={decrementMonth} />
                    <Pressable
                        onPress={() => {
                            navigation.navigate('ResrvationDateSelect',
                                {
                                    date: date.toString(),
                                });
                        }}>
                        <Text style={styles.MonthNumber}>
                            {`${date.getMonth() + 1}월`}
                        </Text>
                    </Pressable>
                    <Pressable style={styles.MonthBtn}
                        onPress={incrementMonth} />
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
                    <Pressable style={{ height: 32, width: 32, backgroundColor: Color['grey200'] }} onPress={prevWeek} />
                    <View style={{ height: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 264, marginHorizontal: 8 }}>
                        {renderWeekOfDate(date)}
                    </View>
                    <Pressable style={{ height: 32, width: 32, backgroundColor: Color['grey200'] }} onPress={nextWeek} />
                </View>
            </View>
            <View style={{ height: 20 }} />
            <ScrollView>
                {times.map((time, index) => {
                    return (
                        <View key={time + index}
                            pointerEvents="none"
                        >
                            <View style={{ flexDirection: 'row', marginHorizontal: 24, alignItems: 'center', height: 24, justifyContent: 'center' }}>
                                <View>
                                    <View style={{ position: 'absolute', height: 9.2, width: 56, top: -2, backgroundColor: (selectedTimeBlocks && selectedTimeBlocks.includes(times[index - 1])) ? Color['blue100'] : '#FFF', }} />
                                    <View style={{ position: 'absolute', height: 10, width: 56, top: 5.2, backgroundColor: (selectedTimeBlocks && selectedTimeBlocks.includes(time)) ? Color['blue100'] : '#FFF', }} />
                                    <Text
                                        style={[
                                            { zIndex: 2, alignSelf: 'center', fontSize: 16, width: 56, textAlign: 'center', color: Color['grey300'], fontFamily: 'NanumSquareNeo-Regular' },
                                            ((selectedTimeBlocks && selectedTimeBlocks.includes(time)) || (selectedTimeBlocks && selectedTimeBlocks.includes(times[index - 1]))) && { color: Color['blue500'] }
                                        ]}
                                    >
                                        {time}
                                    </Text>
                                </View>

                            </View>
                            {index < times.length - 1 && <View style={{ height: 56 }} />}

                        </View>
                    );
                })}
                <View style={{ position: 'absolute', flex: 1, top: 11, bottom: 12, zIndex: 2 }}
                    pointerEvents="none"
                >
                    {times.map((time, index) => {
                        if (occupiedTimes?.includes(time))
                            return (<View style={[{ height: 78, backgroundColor: Color['grey200'], marginVertical: 1, left: 36, width: (width - 120) / 2 }, index != 0 && { top: -index * 2, height: 80 },]}></View>)
                        return (<View style={[{ height: 80, marginHorizontal: 24, }, index != 0 && { top: -index * 2, height: 82 },]}></View>)
                    })}
                </View>

                <View style={{ position: 'absolute', flex: 1, top: 11, bottom: 12, zIndex: -1 }}>
                    {times.map((time, index) => {
                        if (index == times.length - 1) return null;
                        return (
                            <Pressable
                                key={time + '_pressable'} // 고유한 key를 부여
                                style={[
                                    { height: 80, borderWidth: 2, borderColor: Color['grey200'], marginHorizontal: 24, width: width - 48, borderStyle: 'dashed' },
                                    index != 0 && { top: -index * 2, height: 82 }, selectedTimeBlocks && selectedTimeBlocks.includes(time) && { backgroundColor: Color['blue100'], borderColor: Color['blue500'], zIndex: 2 }
                                ]}
                                onPress={() => { toggleTime(time) }}
                            />
                        );
                    })}
                </View>
            </ScrollView>

            <View style={{ height: 20 }} />
            {selectedTimeBlocks && selectedTimeBlocks?.length != 0 && <View>
                <LongButton color='blue' innerText={`${selectedTimeBlocks[0]}:00 ~ ${times[times.indexOf(selectedTimeBlocks[selectedTimeBlocks.length - 1]) + 1]}:00 예약`}
                    isAble={true}
                    onPress={() => {
                        const overlappingTimes = occupiedTimes.filter(time => selectedTimeBlocks.includes(time));

                        if (overlappingTimes.length > 0) {
                            setAlertVisible(true)
                        } else {
                            setTime(parseTime(selectedTimeBlocks[0]), parseTime(selectedTimeBlocks[selectedTimeBlocks.length - 1]) + 1)
                            navigation.navigate('Reservation');
                        }

                    }} />
            </View>}
            <Modal visible={alertVisble} transparent>
                <Pressable style={{ backgroundColor: 'rgba(0,0,0,0.4)', flex: 1, justifyContent: 'center' }} onPress={() => setAlertVisible(false)}>
                    <Pressable style={{ marginHorizontal: 28, height: 200, backgroundColor: '#FFF', borderRadius: 15 }} onPress={(e) => e.stopPropagation()} >
                        <Text style={alertStyle.Header}>중복 알림</Text>
                        <Text style={alertStyle.Script}>{`이미 있는 예약과 중복이 발생하여\n대기 순번으로 밀리게 돼요.`}</Text>
                        <View style={{ position: 'absolute', flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 8, width: width - 56 - 16, bottom: 16 }}>
                            <ShortButton color='red' innerText='취소' isFilled={true} onPress={() => { setAlertVisible(false) }} />
                            <ShortButton color='blue' innerText='대기 진행' isFilled={true} onPress={() => {
                                setTime(parseTime(selectedTimeBlocks![0]), parseTime(selectedTimeBlocks![selectedTimeBlocks!.length - 1]) + 1)
                                navigation.navigate('Reservation');
                                setHasWait(true)
                            }} />
                        </View>
                    </Pressable>
                </Pressable>
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
        textAlign: 'center',
        fontSize: 20,
        marginHorizontal: 16,
        fontFamily: 'NanumSquareNeo-Bold',
        color: Color['grey700']
    },
    MonthBtn: {
        width: 28,
        height: 28,
        backgroundColor: Color['blue500']
    },
})