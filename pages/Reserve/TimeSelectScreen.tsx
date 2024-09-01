import { Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Color } from '../../ColorSet';
import LongButton from '../../components/buttons/LongButton';

const { width } = Dimensions.get(`window`)

const TimeSelectScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

    const { date } = route.params
    const [selectedDate, setDate] = useState(date ? new Date(date) : new Date)
    const [selectedTimes, setTimes] = useState<string[] | null>(null);
    const [isWeekCalendar, setWeekCalendar] = useState(true)
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

    useEffect(() => {
        const { startTime, endTime } = route.params
        if (startTime && endTime) {
            const startIdx = times.indexOf(startTime);
            const endIdx = times.indexOf(endTime)+1;

            const loadedTimes = times.slice(startIdx, endIdx);

            setTimes(loadedTimes);
        }
    }, [route])

    const toggleTime = useCallback((time: string) => {
        // selectedTimes를 정렬된 상태로 유지
        const lastTimes = selectedTimes?.sort((a, b) => times.indexOf(a) - times.indexOf(b)) ?? [];

        const timeIndex = times.indexOf(time);
        const firstSelectedTimeIndex = times.indexOf(lastTimes[0]);
        const lastSelectedTimeIndex = times.indexOf(lastTimes[lastTimes.length - 1]);

        if (!lastTimes.includes(time)) {
            if (lastTimes.length === 0) {
                lastTimes.push(time);
                setTimes([...lastTimes]);
            } else if (timeIndex === firstSelectedTimeIndex - 1 || timeIndex === lastSelectedTimeIndex + 1) {
                lastTimes.push(time);
                setTimes([...lastTimes]);
            } else {
                const startIndex = Math.min(timeIndex, firstSelectedTimeIndex);
                const endIndex = Math.max(timeIndex, lastSelectedTimeIndex);
                const newTimes = times.slice(startIndex, endIndex + 1);

                setTimes([...newTimes]);
            }
        } else {
            const index = lastTimes.indexOf(time);
            if (index > -1) {
                if ((index === 0 && timeIndex === firstSelectedTimeIndex) || (index === lastTimes.length - 1 && timeIndex === lastSelectedTimeIndex)) {
                    lastTimes.splice(index, 1);
                    setTimes([...lastTimes]);
                } else {
                    //제거 불가능 알럿 출력
                }
            }
        }
    }, [selectedTimes, setTimes, times]);

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

    useEffect(() => {
        // fetch 함수 구현
    }, [selectedDate])

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
                <Pressable onPress={() => { navigation.navigate('ResrvationDateSelect',{date:selectedDate.toString()}); }} style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, left: 22, width: 28, height: 28, backgroundColor: Color['grey300'] }}>
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
                                    date: selectedDate.toString(),
                                });
                        }}>
                        <Text style={styles.MonthNumber}>
                            {`${selectedDate.getMonth() + 1}월`}
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
                        {renderWeekOfDate(selectedDate)}
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
                                    <View style={{ position: 'absolute', height: 9.2, width: 56, top: -2, backgroundColor: (selectedTimes && selectedTimes.includes(times[index - 1])) ? Color['blue100'] : '#FFF', }} />
                                    <View style={{ position: 'absolute', height: 10, width: 56, top: 5.2, backgroundColor: (selectedTimes && selectedTimes.includes(time)) ? Color['blue100'] : '#FFF', }} />
                                    <Text
                                        style={[
                                            { zIndex: 2, alignSelf: 'center', fontSize: 16, width: 56, textAlign: 'center', color: Color['grey300'], fontFamily: 'NanumSquareNeo-Regular' },
                                            ((selectedTimes && selectedTimes.includes(time)) || (selectedTimes && selectedTimes.includes(times[index - 1]))) && { color: Color['blue500'] }
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
                                    index != 0 && { top: -index * 2, height: 82 }, selectedTimes && selectedTimes.includes(time) && { backgroundColor: Color['blue100'], borderColor: Color['blue500'], zIndex: 2 }
                                ]}
                                onPress={() => { toggleTime(time) }}
                            />
                        );
                    })}
                </View>
            </ScrollView>

            <View style={{ height: 20 }} />
            {selectedTimes && selectedTimes?.length != 0 && <View>
                <LongButton color='blue' innerText={`${selectedTimes[0]}:00 ~ ${times[times.indexOf(selectedTimes[selectedTimes.length - 1]) + 1]}:00 예약`}
                    isAble={true}
                    onPress={() => {
                        const overlappingTimes = occupiedTimes.filter(time => selectedTimes.includes(time));

                        if (overlappingTimes.length > 0) {
                        } else {
                            // 예약 로직을 여기에 추가
                        }
                        navigation.navigate('Reservation',
                            {
                                date: selectedDate.toString(),
                                startTime: selectedTimes[0],
                                endTime: selectedTimes[selectedTimes.length - 1]
                            }
                        );
                    }} />
            </View>}
        </View>
    )
}

export default TimeSelectScreen

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