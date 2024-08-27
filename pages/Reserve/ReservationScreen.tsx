import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback } from 'react'
import CheckboxComponent from '../../components/checkboxs/CheckboxComponent'
import { Color } from '../../ColorSet'
import LongButton from '../../components/buttons/LongButton'

const ReservationScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const { date } = route.params
    const selectedDate = new Date(date);
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const DateString = useCallback(() => {
        return `${selectedDate.getFullYear()}.${(selectedDate.getMonth() + 1)}.${selectedDate.getDate()}(${daysOfWeek[selectedDate.getDay()]})`
    }, [])

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <ScrollView>
                <View style={{ height: 24 }} />
                <Text style={{ marginHorizontal: 24, fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약 일시</Text>
                <View style={{ height: 16 }} />
                <View style={{ height: 100, marginHorizontal: 40, backgroundColor: Color['grey100'], borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 8, alignItems: 'center' }}>
                        <View style={{ height: 24, width: 24, backgroundColor: Color['grey300'], marginRight: 6 }} />
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>{DateString()}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>18:00</Text>
                        <View style={{ width: 72, paddingVertical: 8, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 5 }}>
                            <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>1시간</Text>
                        </View>
                        <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>19:00</Text>
                    </View>
                </View>

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
                    <View style={{ width: 218, height: 36, borderRadius: 5, borderWidth: 1 }}></View>
                </View>

                <View style={{ height: 20 }} />

                <View style={{ marginHorizontal: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>참여 가능</Text>
                    <View style={{ width: 218, height: 36, borderRadius: 5, borderWidth: 1 }}></View>
                </View>

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

                    <Pressable style={{ marginHorizontal: 16 }}>
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
                <CheckboxComponent
                    innerText='예약 전날 오후10시까지 수정*취소할 수 있어요'
                ></CheckboxComponent>
                <LongButton
                    color='blue'
                    innerText='예약하기'
                    isAble={false}
                    onPress={() => { }}
                />
            </View>
        </View>
    )
}

export default ReservationScreen

const styles = StyleSheet.create({})