import { ActivityIndicator, Dimensions, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Color } from '../../ColorSet';
import useFetch from '../../hoc/useFetch';
import { Reserve } from '../Home/MyClub/ClubCalendar/ClubCalendar';
import { BASBASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get(`window`)

const DailyReserveListScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

    const { date } = route.params;
    const [selectedDate, setDate] = useState(new Date(date))
    const [isWeekCalendar, setWeekCalendar] = useState(true)
    const today = new Date()

    const times = ['AM10', 'AM11', 'PM12', 'PM01', 'PM02', 'PM03', 'PM04', 'PM05', 'PM06', 'PM07', 'PM08', 'PM09', 'PM10'];
    const [token, setToken] = useState<string | null>(null);

    const loadToken = useCallback(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
        };

        fetchToken();
    }, [])

    useEffect(() => {
        loadToken();
    }, []);

    // 토큰을 불러온 후 useFetch 실행
    const { data, loading, error } = useFetch<Reserve[]>(
        token ? `${BASBASE_URL}/reservation/search` : null,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
            },
            body: JSON.stringify({ date: selectedDate.toISOString() })
        }, 2000, [token, selectedDate]
    );

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
    const renderWeekOfDate = useCallback((selectedDate: Date) => {
        const day = selectedDate.getDay() == 0 ? 7 : selectedDate.getDay();
        const week = [];
        const startDate = new Date(selectedDate);
        startDate.setDate(selectedDate.getDate() - day + 1);

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            week.push(
                <Pressable key={`${currentDate}`} onPress={() => setDate(currentDate)} style={[{ width: 28, height: 28, borderRadius: 5, justifyContent: 'center' }, selectedDate.getDate() == currentDate.getDate() && { backgroundColor: Color['blue100'] }]}>
                    <Text style={[styles.Date, selectedDate.getMonth() != currentDate.getMonth() && { color: Color['grey300'] }]}>{currentDate.getDate()}</Text>
                </Pressable>
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
                <Pressable onPress={() => { navigation.navigate('ReserveCalendar', { date: selectedDate.toString() }); }} style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, left: 22, width: 28, height: 28, backgroundColor: Color['grey300'] }}>
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

                    <Text style={styles.MonthNumber}>
                        {`${selectedDate.getMonth() + 1}월`}
                    </Text>
                    <Pressable style={styles.MonthBtn}
                        onPress={incrementMonth} />
                </View>
                {today <= selectedDate && <Pressable onPress={() => navigation.push('Reservation', { date: selectedDate.toDateString() })} style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 11, right: 22, height: 28, backgroundColor: Color['grey300'] }}>
                    <Text style={{
                        fontFamily: "NanumSquareNeo-Bold", color: Color['blue500'],
                        fontSize: 18,
                        textAlign: 'right',
                        textAlignVertical: 'center'
                    }}>{'추가'}</Text>
                </Pressable>}
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
                        <View>
                            <View key={time + index} style={{ flexDirection: 'row', marginHorizontal: 24, alignItems: 'center', height: 24 }}>
                                <View style={{ height: 1, backgroundColor: Color.grey200, width: (width - 48) / 2 - 28, overflow: 'visible' }} />
                                <Text style={{ alignSelf: 'center', fontSize: 16, width: 56, textAlign: 'center', color: Color[`grey300`], fontFamily: 'NanumSquareNeo-Regular' }}>{time}</Text>
                                <View style={{ height: 1, backgroundColor: Color.grey200, width: (width - 48) / 2 - 28, overflow: 'visible' }} />
                            </View>
                            {index < times.length - 1 && <View style={{ height: 56 }} />}
                        </View>)
                })}

                <Modal
                    visible={loading}
                    transparent
                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                        <ActivityIndicator size={'large'} color={'#FFF'} />
                    </View>
                </Modal>

                {data && data?.map((reserve) => {
                    const reserveTop = 12 + (reserve.startTime - 10) * 80;
                    const reserveHeight = 80 * (reserve.endTime - reserve.startTime)
                    return (
                        <View>
                            <View style={{ position: 'absolute', top: reserveTop, width: width - 72 - 80, height: reserveHeight, borderRadius: 10, borderWidth: 2, borderColor: Color['red500'], backgroundColor: '#FFF', marginHorizontal: 36 }}>
                                <Text style={{ position: 'absolute', top: 10, left: 16, fontSize: 18, fontFamily: 'NanumSquareNeo-Bold' }}>{reserve.title}</Text>

                                <View style={{ position: 'absolute', top: 46, left: 14, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ height: 24, width: 24, backgroundColor: Color['grey200'], marginRight: 4 }} />
                                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], }}>24</Text>
                                </View>
                                <View style={{ position: 'absolute', top: 10, right: 14, alignItems: 'flex-end' }}>
                                    <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700'] }}>{reserve.name}</Text>
                                    {reserve.nickname && <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>{reserve.nickname}</Text>}
                                </View>
                            </View>
                            <Pressable style={{ position: 'absolute', top: reserveTop, width: 80, height: reserveHeight, right: 0, justifyContent: 'center', alignItems: 'center', marginHorizontal: 36 }}
                                onPress={() => { console.log('더보기') }}>
                                <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'], marginBottom: 4 }}>대기 1</Text>
                                <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'] }}>자세히</Text>
                            </Pressable>
                        </View>
                    )
                })}

                <View style={{ position: 'absolute', top: 92, width: width - 72, height: 80, borderRadius: 10, borderWidth: 2, borderColor: Color['blue500'], backgroundColor: '#FFF', marginHorizontal: 36 }}>
                    <Text style={{ position: 'absolute', top: 10, left: 16, fontSize: 18, fontFamily: 'NanumSquareNeo-Bold' }}>설장구 연습</Text>

                    <View style={{ position: 'absolute', top: 46, left: 14, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ height: 24, width: 24, backgroundColor: Color['grey200'], marginRight: 4 }} />
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], }}>24</Text>
                    </View>
                    <View style={{ position: 'absolute', top: 0, right: 20, width: 28, height: 42, backgroundColor: Color['blue500'] }} />
                </View>

                <View style={{ position: 'absolute', top: 332, width: width - 72, height: 200, borderRadius: 10, borderWidth: 2, borderColor: Color['green500'], backgroundColor: '#FFF', marginHorizontal: 36 }}>
                    <Text style={{ position: 'absolute', top: 10, left: 16, fontSize: 18, fontFamily: 'NanumSquareNeo-Bold' }}>설장구 연습</Text>
                    <View style={{ position: 'absolute', top: 46, left: 14, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ height: 24, width: 24, backgroundColor: Color['grey200'], marginRight: 4 }} />
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], }}>24</Text>
                    </View>
                    <View style={{ position: 'absolute', top: 10, right: 14, alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700'] }}>홍길동</Text>
                        <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>길동색시</Text>
                    </View>
                    <Text style={{ position: 'absolute', bottom: 8, right: 14, fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>
                        14:00~16:30
                    </Text>
                </View>
            </ScrollView>

            <View style={{ height: 20 }} />
        </View>
    )
}

export default DailyReserveListScreen

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