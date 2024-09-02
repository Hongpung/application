import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Image, Dimensions } from 'react-native'
import React, { useCallback, useState } from 'react'
import CheckboxComponent from '../../components/checkboxs/CheckboxComponent'
import { Color } from '../../ColorSet'
import LongButton from '../../components/buttons/LongButton'
import { useReservation } from '../../context/ReservationContext'
import { instrumentOrder } from '../../UserType'

const { width } = Dimensions.get('window')

const ReservationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const {
        reservation,
        setName,
        setIsRegular,
        setIsParticipatible,
        setParticipants,
        setBorrowInstruments
    } = useReservation();

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const [isAgree, setAgree] = useState(false)

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
                        if (reservation.date)
                            navigation.push('TimeSelect')
                        else navigation.push('ResrvationDateSelect')
                    }}>
                    <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 8, alignItems: 'center' }}>
                        <View style={{ height: 24, width: 24, backgroundColor: Color['grey300'], marginRight: 6 }} />
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>{reservation.date && DateString(reservation.date)}</Text>
                    </View>
                    {reservation.Time.startTime && reservation.Time.endTime ?
                        <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>{reservation.Time.startTime}:00</Text>
                            <View style={{ width: 72, paddingVertical: 8, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 5 }}>
                                <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>{reservation.Time.endTime - reservation.Time.startTime}시간</Text>
                            </View>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>{reservation.Time.endTime}:00</Text>
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
                        <TextInput textAlign='right' style={{ marginHorizontal: 12, paddingVertical: 4, fontSize: 16 }} onChangeText={value => setName(value)} />
                    </View>
                </View>

                <View style={{ height: 28 }} />

                <Text style={{ marginHorizontal: 24, fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약유형</Text>

                <View style={{ height: 24 }} />

                <View style={{ marginHorizontal: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>정기 연습</Text>
                    <View style={{ width: 218, height: 36, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0.5, borderColor: reservation.isRegular ? Color['blue500'] : Color['red500'] }, reservation.isRegular && { backgroundColor: Color['blue100'] }]}
                            onPress={() => { setIsRegular(true) }}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation.isRegular ? { color: Color['blue600'] } : { color: Color['red300'] }]}>
                                예
                            </Text>
                        </Pressable>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderLeftWidth: 0.5, borderColor: reservation.isRegular ? Color['blue500'] : Color['red500'] }, !reservation.isRegular && { backgroundColor: Color['red100'] }]}
                            onPress={() => { setIsRegular(false) }}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation.isRegular ? { color: Color['blue300'] } : { color: Color['red600'] }]}>
                                아니오
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View style={{ height: 20 }} />

                {reservation.isRegular ? <View style={{ marginHorizontal: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0.5, borderColor: reservation.isParticipatible ? Color['blue500'] : Color['red500'] }, reservation.isParticipatible && { backgroundColor: Color['blue100'] }]}
                            onPress={() => { setIsParticipatible(true) }}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation.isParticipatible ? { color: Color['blue600'] } : { color: Color['red300'] }]}>
                                예
                            </Text>
                        </Pressable>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderLeftWidth: 0.5, borderColor: reservation.isParticipatible ? Color['blue500'] : Color['red500'] }, !reservation.isParticipatible && { backgroundColor: Color['red100'] }]}
                            onPress={() => { setIsParticipatible(false) }}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation.isParticipatible ? { color: Color['blue300'] } : { color: Color['red600'] }]}>
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
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => setParticipants([])}>
                            <View style={{ height: 16, width: 16, backgroundColor: Color['grey300'] }} />
                            <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey300'] }}>초기화</Text>
                        </Pressable>
                    </View>

                    <View style={{ height: 16 }} />

                    <Pressable style={{ marginHorizontal: 16 }}
                    >
                        <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 4, height: 72, borderColor: Color['grey200'], borderStyle: 'dashed' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'] }}>+</Text>
                        </View>
                    </Pressable>
                </View>

                <View style={{ height: 32 }} />

                <View style={{ marginHorizontal: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>대여 악기</Text>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => setBorrowInstruments([])}>
                            <View style={{ height: 16, width: 16, backgroundColor: Color['grey300'] }} />
                            <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey300'] }}>초기화</Text>
                        </Pressable>
                    </View>

                    <View style={{ height: 16 }} />

                    <Pressable style={{ marginHorizontal: 16 }}
                        onPress={() => navigation.push('BorrowInstrumentSelect')}>
                        {reservation.borrowInstruments.length > 0 ?
                            <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, height: 72, backgroundColor: Color['grey200'] }}>
                                <View style={{ flexDirection: 'row' }}>
                                    {['쇠', '장구', '북', '소고', '새납'].map((type, index) => {
                                        const instCount = reservation.borrowInstruments.filter((instrument) => instrument.type == type).length
                                        return (<View style={{ width: (width - 96) / 5, alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14 }}>{type}</Text>
                                            <View style={{height:8}}/>
                                            <Text style={instCount > 0 ? { fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, color: Color['blue500'] } : { fontFamily: 'NanumSquareNeo-Bold', fontSize: 20, color: Color['grey300'] }}>{instCount > 0 ? instCount : '-'}</Text>
                                        </View>)
                                    })}
                                </View>
                            </View> :
                            <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 4, height: 72, borderColor: Color['grey200'], borderStyle: 'dashed' }}>
                                <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'] }}>+</Text></View>
                        }
                    </Pressable>
                </View>

                <View style={{ height: 16 }} />
            </ScrollView>
            <View style={{ marginHorizontal: 24, marginVertical: 8, height: 100 }}>
                <View style={{ height: 40, alignSelf: 'center' }}>
                    <CheckboxComponent
                        innerText={reservation.hasToWait ? '예약 전날 오후10시 이전까지 자동 취소돼요' : '예약 전날 오후10시까지 수정*취소할 수 있어요'}
                        onCheck={() => setAgree(!isAgree)}
                    ></CheckboxComponent>
                </View>
                <LongButton
                    color={reservation.hasToWait ? 'green' : 'blue'}
                    innerText={reservation.hasToWait ? '대기열에 추가하기' : '예약하기'}
                    isAble={isAgree}
                    onPress={() => { }}
                />
            </View>
        </View>
    )
}


export default ReservationScreen

const styles = StyleSheet.create({})