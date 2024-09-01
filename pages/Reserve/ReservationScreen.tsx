import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import CheckboxComponent from '../../components/checkboxs/CheckboxComponent'
import { Color } from '../../ColorSet'
import LongButton from '../../components/buttons/LongButton'
import { useFocusEffect } from '@react-navigation/native'
import { Instrument } from '../../UserType'

const ReservationScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

    const [selectedDate, setDate] = useState<Date | null>(null)
    const [startTime, setStartTime] = useState<number | null>(null)
    const [endTime, setEndTime] = useState<number | null>(null)
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const [isParticipatible, setParticipatible] = useState(true);
    const [isRegular, setRegular] = useState(true);
    const [isAgree, setAgree] = useState(false)
    const [borrowInstrumnetList, setBorrowInstruments] = useState<Instrument[] | null>(null)

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
    useFocusEffect(
        useCallback(() => {
            // 필요한 작업을 여기에 추가
            if (route.params) {
                console.log(route.params)
                const { date }: { date: null | any } = route.params
                setDate(new Date(date))

                const { startTime, endTime }: { startTime: null | string, endTime: null | string } = route.params;

                if (startTime) {
                    setStartTime(parseTime(startTime));
                }

                if (endTime) {
                    setEndTime(parseTime(endTime) + 1);
                }
            }
        }, [route.params])
    );

    const DateString = useCallback((selectedDate: Date) => {
        return `${selectedDate.getFullYear()}.${(selectedDate.getMonth() + 1)}.${selectedDate.getDate()}(${daysOfWeek[selectedDate.getDay()]})`
    }, [])

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <ScrollView>
                <View style={{ height: 24 }} />
                <Text style={{ marginHorizontal: 24, fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약 일시</Text>
                <View style={{ height: 16 }} />
                <Pressable style={{ height: 100, marginHorizontal: 40, backgroundColor: Color['grey100'], borderRadius: 10 }}
                    onPress={() => {
                        if (selectedDate)
                            navigation.push('TimeSelect',
                                {
                                    date: selectedDate.toString(),
                                    startTime: startTime ? formatTime(startTime) : null,
                                    endTime: endTime ? formatTime(endTime - 1) : null
                                })
                        else navigation.push('ResrvationDateSelect')
                    }}>
                    <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 8, alignItems: 'center' }}>
                        <View style={{ height: 24, width: 24, backgroundColor: Color['grey300'], marginRight: 6 }} />
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>{selectedDate && DateString(selectedDate)}</Text>
                    </View>
                    {endTime && startTime ?
                        <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>{startTime}:00</Text>
                            <View style={{ width: 72, paddingVertical: 8, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 5 }}>
                                <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>{endTime - startTime}시간</Text>
                            </View>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>{endTime}:00</Text>
                        </View> :
                        <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>시간 선택하러 가기</Text>
                        </View>}
                </Pressable>

                <View style={{ height: 28 }} />

                <View style={{ height: 16, backgroundColor: Color['grey100'] }}></View>

                <View style={{ height: 24 }} />

                <View style={{ marginHorizontal: 24 }}>
                    <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약명</Text>
                    <View style={{ marginTop: 20, marginHorizontal: 16, borderBottomWidth: 1 }}>
                        <TextInput textAlign='right' style={{ marginHorizontal: 12, paddingVertical: 4, fontSize: 16 }} />
                    </View>
                </View>

                <View style={{ height: 28 }} />

                <Text style={{ marginHorizontal: 24, fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약유형</Text>

                <View style={{ height: 24 }} />

                <View style={{ marginHorizontal: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>정기 연습</Text>
                    <View style={{ width: 218, height: 36, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0.5, borderColor: isRegular ? Color['blue500'] : Color['red500'] }, isRegular && { backgroundColor: Color['blue100'] }]}
                            onPress={() => { setRegular(true) }}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, isRegular ? { color: Color['blue600'] } : { color: Color['red300'] }]}>
                                예
                            </Text>
                        </Pressable>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderLeftWidth: 0.5, borderColor: isRegular ? Color['blue500'] : Color['red500'] }, !isRegular && { backgroundColor: Color['red100'] }]}
                            onPress={() => { setRegular(false) }}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, isRegular ? { color: Color['blue300'] } : { color: Color['red600'] }]}>
                                아니오
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View style={{ height: 20 }} />

                {isRegular ? <View style={{ marginHorizontal: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>참여 가능</Text>
                    <View style={{ width: 218, height: 36, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[{ width: 108, alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0.5, borderColor: Color['grey400'] }]}>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['grey300'] }}>
                                예
                            </Text>
                        </View>
                        <View style={[{ width: 108, alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderLeftWidth: 0.5, borderColor: Color['grey400'], backgroundColor: Color['grey100'] }]}>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['grey400'] }}>
                                아니오
                            </Text>
                        </View>
                    </View>
                </View> : <View style={{ marginHorizontal: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>참여 가능</Text>
                    <View style={{ width: 218, height: 36, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0.5, borderColor: isParticipatible ? Color['blue500'] : Color['red500'] }, isParticipatible && { backgroundColor: Color['blue100'] }]}
                            onPress={() => { setParticipatible(true) }}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, isParticipatible ? { color: Color['blue600'] } : { color: Color['red300'] }]}>
                                예
                            </Text>
                        </Pressable>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderLeftWidth: 0.5, borderColor: isParticipatible ? Color['blue500'] : Color['red500'] }, !isParticipatible && { backgroundColor: Color['red100'] }]}
                            onPress={() => { setParticipatible(false) }}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, isParticipatible ? { color: Color['blue300'] } : { color: Color['red600'] }]}>
                                아니오
                            </Text>
                        </Pressable>
                    </View>
                </View>}

                <View style={{ height: 24 }} />

                <View style={{ height: 16, backgroundColor: Color['grey100'] }}></View>

                <View style={{ height: 24 }} />

                <View style={{ marginHorizontal: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>참여자</Text>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ height: 16, width: 16, backgroundColor: Color['grey300'] }} />
                            <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey300'] }}>초기화</Text>
                        </Pressable>
                    </View>

                    <View style={{ height: 16 }} />

                    <Pressable style={{ marginHorizontal: 16 }}
                        onPress={() => navigation.push('BorrowInstrumentSelect', { insrument: borrowInstrumnetList })}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 4, height: 72, borderColor: Color['grey200'], borderStyle: 'dashed' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'] }}>+</Text>
                        </View>
                    </Pressable>
                </View>

                <View style={{ height: 32 }} />

                <View style={{ marginHorizontal: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>대여 악기</Text>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ height: 16, width: 16, backgroundColor: Color['grey300'] }} />
                            <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey300'] }}>초기화</Text>
                        </Pressable>
                    </View>

                    <View style={{ height: 16 }} />

                    <Pressable style={{ marginHorizontal: 16 }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 4, height: 72, borderColor: Color['grey200'], borderStyle: 'dashed' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'] }}>+</Text>
                        </View>
                    </Pressable>
                </View>

                <View style={{ height: 16 }} />
            </ScrollView>
            <View style={{ marginHorizontal: 24, marginVertical: 8, height: 100 }}>
                <View style={{ marginHorizontal: 18, height: 40 }}>
                    <CheckboxComponent
                        innerText='예약 전날 오후10시까지 수정*취소할 수 있어요'
                        onCheck={() => setAgree(!isAgree)}
                    ></CheckboxComponent>
                </View>
                <LongButton
                    color='blue'
                    innerText='예약하기'
                    isAble={isAgree}
                    onPress={() => { }}
                />
            </View>
        </View>
    )
}

export default ReservationScreen

const styles = StyleSheet.create({})