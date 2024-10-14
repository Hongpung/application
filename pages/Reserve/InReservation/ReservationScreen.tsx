import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Image, Dimensions, ActivityIndicator, Alert } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CheckboxComponent from '@hongpung/components/checkboxs/CheckboxComponent'
import { Color } from '@hongpung/ColorSet'
import LongButton from '@hongpung/components/buttons/LongButton'
import { useReservation } from '@hongpung/pages/Reserve/context/ReservationContext'
import { loginUserState } from '@hongpung/recoil/authState'
import { useRecoilValue } from 'recoil'
import { getToken } from '@hongpung/utils/TokenHandler'
import { areReservationsEqual, parseToReservation } from '../ReserveInterface'
import { useFocusEffect } from '@react-navigation/native'
import { Icons } from '@hongpung/components/Icon'

const { width } = Dimensions.get('window')

const ReservationScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

    const {
        reservation,
        preReservation,
        setPreReservation,
        setReservation,
        setName,
        setIsRegular,
        setIsParticipatible,
        setParticipants,
        setBorrowInstruments,
        setDate
    } = useReservation();

    const { date } = route?.params ?? { date: preReservation?.date };
    const { reservationId } = route?.params ?? { reservationId: preReservation?.reservationId };

    const [isLoading, setLoading] = useState(false);
    const loginUser = useRecoilValue(loginUserState);

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const [isAgree, setAgree] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setAgree(false)
        }, [])
    );

    const DateString = useCallback((selectedDate: Date) => {
        return `${selectedDate.getFullYear()}.${(selectedDate.getMonth() + 1)}.${selectedDate.getDate()}(${daysOfWeek[selectedDate.getDay()]})`
    }, [])

    const TimeGapText = useMemo(() => {
        const endTime = Number(reservation.Time.endTime.toString().slice(5, 7)) * 60 + Number(reservation.Time.endTime.toString().slice(7));
        const startTime = Number(reservation.Time.startTime.toString().slice(5, 7)) * 60 + Number(reservation.Time.startTime.toString().slice(7));

        const timeGap = endTime - startTime;

        const hourGap = timeGap / 60;
        const minnuteGap = timeGap % 60;

        return `${hourGap >= 1 ? `${Math.floor(hourGap)}시간` : ''}${minnuteGap > 0 && hourGap >= 1 ? `\n` : ''}${minnuteGap > 0 ? `${minnuteGap}분` : ''}`
    }, [reservation.Time])

    useEffect(() => {
        const load = async () => {
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {
                setLoading(true);
                const token = await getToken('token');
                if (!token) throw Error('token is not valid')
                const response = await fetch(`${process.env.BASE_URL}/reservation/${reservationId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application',
                            'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
                        },
                        signal
                    }
                )
                const loadedReservation = await response.json();
                const parsedReservation = parseToReservation(loadedReservation);

                setReservation(parsedReservation)
                setPreReservation(parsedReservation)
            } catch (e) {
                console.error(e);
                navigation.goBack();
            } finally {
                setLoading(false);
                clearTimeout(timeoutId);
            }

        }

        reservationId && load();
        date && setDate(new Date(date))

    }, [reservationId])

    if (isLoading)
        return (
            <View style={{ backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <ActivityIndicator size={'large'} color={Color['blue500']}></ActivityIndicator>
            </View>
        )
    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <ScrollView>
                <View style={{ height: 24 }} />
                <Text style={{ marginHorizontal: 24, fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약 일시</Text>
                <View style={{ height: 16 }} />
                <Pressable style={{ height: 100, marginHorizontal: 40, backgroundColor: Color['grey100'], borderRadius: 10 }}
                    onPress={() => {
                        if (reservation?.date)
                            navigation.push('TimeSelect')
                        else navigation.push('ResrvationDateSelect')
                    }}>
                    <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 8, alignItems: 'center' }}>
                        {reservation?.date && <View style={{ height: 24, width: 24, marginRight: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                            <Icons name='calendar-outline' size={20} color={Color['grey400']} />
                        </View>}
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>{reservation.date && DateString(new Date(reservation.date))}</Text>
                    </View>
                    {reservation.Time.startTime && reservation.Time.endTime ?
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>{`${reservation.Time.startTime.toString().slice(5, 7)}:${reservation.Time.startTime.toString().slice(7)}`}</Text>
                            <View style={{ width: 64, paddingVertical: 8, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 5 }}>
                                <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', textAlign: 'center', color: Color['grey700'] }}>{TimeGapText}</Text>
                            </View>
                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>{`${reservation.Time.endTime.toString().slice(5, 7)}:${reservation.Time.endTime.toString().slice(7)}`}</Text>
                        </View> :
                        reservation?.date ?
                            <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>시간 선택하러 가기</Text>
                            </View> :
                            <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>예약 일시 선택하러 가기</Text>
                            </View>}
                </Pressable>

                <View style={{ height: 28 }} />

                <View style={{ height: 16, backgroundColor: Color['grey100'] }}></View>

                <View style={{ height: 24 }} />

                <View style={{ marginHorizontal: 24 }}>
                    <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약명</Text>
                    <View style={{ marginTop: 20, marginHorizontal: 16, borderBottomWidth: 1 }}>
                        <TextInput textAlign='right' placeholder={`${loginUser?.nickname ? loginUser.nickname : loginUser?.name}의 연습`} value={reservation.reservationName} style={{ marginHorizontal: 12, paddingVertical: 4, fontSize: 16 }} onChangeText={value => setName(value)} />
                    </View>
                </View>

                <View style={{ height: 28 }} />

                <Text style={{ marginHorizontal: 24, fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약유형</Text>

                <View style={{ height: 24 }} />

                <View style={{ marginHorizontal: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>정기 연습</Text>
                    <View style={{ width: 218, height: 36, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0.5, borderColor: reservation.isRegular ? Color['blue500'] : Color['red500'] }, reservation.isRegular && { backgroundColor: Color['blue100'] }]}
                            onPress={() => { setIsRegular(true); setIsParticipatible(false); }}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation.isRegular ? { color: Color['blue600'] } : { color: Color['red300'] }]}>
                                예
                            </Text>
                        </Pressable>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderLeftWidth: 0.5, borderColor: reservation.isRegular ? Color['blue500'] : Color['red500'] }, !reservation.isRegular && { backgroundColor: Color['red100'] }]}
                            onPress={() => setIsRegular(false)}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation.isRegular ? { color: Color['blue300'] } : { color: Color['red600'] }]}>
                                아니오
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View style={{ height: 20 }} />

                <View style={{ marginHorizontal: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>열린 연습</Text>
                    <View style={{ width: 218, height: 36, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0.5, borderColor: reservation.isRegular ? Color['grey400'] : reservation.isParticipatible ? Color['blue500'] : Color['red500'] }, !reservation.isRegular && reservation.isParticipatible && { backgroundColor: Color['blue100'] }]}
                            onPress={() => !reservation.isRegular && setIsParticipatible(true)}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation.isRegular ? { color: Color['grey300'] } : reservation.isParticipatible ? { color: Color['blue600'] } : { color: Color['red300'] }]}>
                                예
                            </Text>
                        </Pressable>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderLeftWidth: 0.5, borderColor: reservation.isRegular ? Color['grey400'] : reservation.isParticipatible ? Color['blue500'] : Color['red500'] }, reservation.isRegular ? { backgroundColor: Color['grey100'] } : !reservation.isParticipatible && { backgroundColor: Color['red100'] }]}
                            onPress={() => !reservation.isRegular && setIsParticipatible(false)}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation.isRegular ? { color: Color['grey400'] } : reservation.isParticipatible ? { color: Color['blue300'] } : { color: Color['red600'] }]}>
                                아니오
                            </Text>
                        </Pressable>
                    </View>
                </View>


                <View style={{ height: 24 }} />

                <View style={{ height: 16, backgroundColor: Color['grey100'] }}></View>

                <View style={{ height: 24 }} />

                <View style={{ marginHorizontal: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>참여자</Text>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
                            onPress={() => setParticipants([])}>
                            <Icons name='refresh' size={16} color={Color['grey400']} />
                            <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey300'] }}>초기화</Text>
                        </Pressable>
                    </View>

                    <View style={{ height: 16 }} />

                    <Pressable style={{ marginHorizontal: 16 }}
                        onPress={() => navigation.push('ParticipantsSelect')}>
                        {reservation.participants.length > 0 ?
                            <View style={{ alignItems: 'center', justifyContent: 'flex-end', borderRadius: 10, height: 72, backgroundColor: Color['grey200'] }}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', width: 120, marginLeft: 24, bottom: 8 }}>
                                        {reservation.participants.slice(0, 4).map(user => (user.profileImageUrl ? <Image
                                            source={{ uri: user.profileImageUrl }} style={{ width: 42, height: 56, }} /> : <View style={{ width: 42, height: 56, backgroundColor: Color['grey300'], borderWidth: 0.5, marginLeft: -4 * reservation.participants.length, borderRadius: 5 }} />))}
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', width: 152, bottom: 12 }}>

                                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Bold', marginRight: 24, color: Color['grey400'] }} numberOfLines={1}>
                                            {reservation.participants.slice(0, 2).map(user => `${user.name} `)}{reservation.participants.length >= 3 && `등`}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginRight: 24 }}>
                                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Bold', color: Color['blue500'] }}>
                                                {reservation.participants.length}
                                            </Text>
                                            <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700'] }}>
                                                {` 명`}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            : <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 4, height: 72, borderColor: Color['grey200'], borderStyle: 'dashed' }}>
                                <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'] }}>+</Text>
                            </View>}
                    </Pressable>
                </View>

                <View style={{ height: 32 }} />

                <View style={{ marginHorizontal: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>대여 악기</Text>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
                            onPress={() => setBorrowInstruments([])}>
                            <Icons name='refresh' size={16} color={Color['grey400']} />
                            <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey300'] }}>초기화</Text>
                        </Pressable>
                    </View>

                    <View style={{ height: 16 }} />

                    <Pressable style={{ marginHorizontal: 16 }}
                        onPress={() => navigation.push('BorrowInstrumentSelect')}>
                        {reservation.borrowInstruments.length > 0 ?
                            <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, height: 72, backgroundColor: Color['grey200'] }}>
                                <View style={{ flexDirection: 'row' }}>
                                    {['쇠', '장구', '북', '소고', '새납'].map((type) => {
                                        const instCount = reservation.borrowInstruments.filter((instrument) => instrument.type == type).length
                                        return (<View style={{ width: (width - 96) / 5, alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14 }}>{type}</Text>
                                            <View style={{ height: 8 }} />
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
            <View style={{ paddingVertical: 8, bottom: 0 }}>
                <View style={{ height: 40, alignSelf: 'center' }}>
                    <CheckboxComponent
                        isChecked={isAgree}
                        innerText={reservation.hasToWait ? '예약 전날 오후10시 이전까지 자동 취소돼요' : '예약 전날 오후10시까지 수정*취소할 수 있어요'}
                        onCheck={() => setAgree(!isAgree)}
                    ></CheckboxComponent>
                </View>
                <LongButton
                    color={reservation.hasToWait ? 'green' : 'blue'}
                    innerText={reservationId ? '수정하기' : reservation.hasToWait ? '대기열에 추가하기' : '예약하기'}
                    isAble={isAgree}
                    onPress={() => {
                        const showAlert = (message: string) => {
                            Alert.alert(
                                '예약 오류', // 타이틀
                                message, // 내용
                                [
                                    {
                                        text: '확인', // 두 번째 버튼 (확인)
                                        onPress: () => setAgree(false)
                                    },
                                ],
                            );
                        };
                        if (areReservationsEqual(reservation, preReservation)) showAlert("기존 예약과 동일합니다.");
                        else {
                            if (reservation.Time.startTime == '') { showAlert("예약 시간이 지정되지 않았습니다.") }
                            else {
                                if (reservationId) navigation.navigate('ReservationEditConfirm')
                                else navigation.navigate('ReservationConfirm')
                            }
                        }
                    }}
                />
            </View>
        </View>
    )
}


export default ReservationScreen

const styles = StyleSheet.create({})