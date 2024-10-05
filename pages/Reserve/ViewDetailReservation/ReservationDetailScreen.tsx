import { Pressable, ScrollView, Text, TextInput, View, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Color } from '@hongpung/ColorSet'
import LongButton from '@hongpung/components/buttons/LongButton'
import { loginUserState } from '@hongpung/recoil/authState'
import { useRecoilValue } from 'recoil'
import { User } from '@hongpung/UserType'
import { getToken } from '@hongpung/utils/TokenHandler'

interface ReservationDetail {
    reservationId: number;            // 예약 ID
    creatorName: string;              // 생성자 이름
    email: string;                    // 생성자 이메일
    date: string;                     // 예약 날짜 (YYYY-MM-DD 형식)
    type: string;                     // 예약 유형 (정기연습, 특별행사 등)
    startTime: string;                // 시작 시간 (HH:MM:SS 형식)
    endTime: string;                  // 종료 시간 (HH:MM:SS 형식)
    message: string;                  // 예약 메시지 또는 설명
    participationAvailable: boolean;  // 참여 가능 여부
    lastmodified: string;             // 마지막 수정 날짜 (ISO 형식)
    participators: User[];    // 참여자 목록 (Participator 배열)
}

const ReservationDetailScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const { reservationId } = route.params


    console.log({ reservationId })
    const loginUser = useRecoilValue(loginUserState);

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    const [reservation, setReservation] = useState<ReservationDetail | null>(null)

    useEffect(() => {
        const load = async () => {
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {
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

                setReservation(loadedReservation)

            } catch (e) {
                console.error(e);
                navigation.goBack()
            } finally {
                clearTimeout(timeoutId);
            }

        }
        load();
    }, [reservationId])

    const DateString = useCallback((selectedDate: Date) => {
        return `${selectedDate.getFullYear()}.${(selectedDate.getMonth() + 1)}.${selectedDate.getDate()}(${daysOfWeek[selectedDate.getDay()]})`
    }, [])

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <ScrollView>
                <View style={{ height: 24 }} />
                <Text style={{ marginHorizontal: 24, fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약 일시</Text>
                <View style={{ height: 16 }} />
                <Pressable style={{ height: 100, marginHorizontal: 40, backgroundColor: Color['grey100'], borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 8, alignItems: 'center' }}>
                        <View style={{ height: 24, width: 24, backgroundColor: Color['grey300'], marginRight: 6 }} />
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>{reservation?.date && DateString(new Date(reservation.date))}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>{reservation?.startTime.slice(0, 2)}:00</Text>
                        <View style={{ width: 72, paddingVertical: 8, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 5 }}>
                            <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>{Number(reservation?.endTime.slice(0, 2)) - Number(reservation?.startTime.slice(0, 2))}시간</Text>
                        </View>
                        <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>{reservation?.endTime.slice(0, 2)}:00</Text>
                    </View>
                </Pressable>

                <View style={{ height: 28 }} />

                <View style={{ height: 16, backgroundColor: Color['grey100'] }}></View>

                <View style={{ height: 24 }} />

                <View style={{ marginHorizontal: 24, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약명</Text>
                    <Text style={{ paddingRight:12, paddingVertical: 4, fontSize: 16, textAlign: 'right' }} >{reservation?.message}</Text>
                </View>

                <View style={{ height: 28 }} />

                <Text style={{ marginHorizontal: 24, fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약유형</Text>

                <View style={{ height: 24 }} />

                <View style={{ marginHorizontal: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>정기 연습</Text>
                    <View style={{ width: 218, height: 36, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0.5, borderColor: reservation?.type == '정기연습' ? Color['blue500'] : Color['red500'] }, reservation?.type == '정기연습' && { backgroundColor: Color['blue100'] }]}
                        >
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation?.type == '정기연습' ? { color: Color['blue600'] } : { color: Color['red300'] }]}>
                                예
                            </Text>
                        </Pressable>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderLeftWidth: 0.5, borderColor: reservation?.type == '정기연습' ? Color['blue500'] : Color['red500'] }, reservation?.type != '정기연습' && { backgroundColor: Color['red100'] }]}
                        >
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation?.type == '정기연습' ? { color: Color['blue300'] } : { color: Color['red600'] }]}>
                                아니오
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View style={{ height: 20 }} />

                <View style={{ marginHorizontal: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>열린 연습</Text>
                    <View style={{ width: 218, height: 36, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0.5, borderColor: reservation?.type == '정기연습' ? Color['grey400'] : reservation?.participationAvailable ? Color['blue500'] : Color['red500'] }, reservation?.type != '정기연습' && reservation?.participationAvailable && { backgroundColor: Color['blue100'] }]}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation?.type == '정기연습' ? { color: Color['grey300'] } : reservation?.participationAvailable ? { color: Color['blue600'] } : { color: Color['red300'] }]}>
                                예
                            </Text>
                        </Pressable>
                        <Pressable style={[{ width: 108, alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderLeftWidth: 0.5, borderColor: reservation?.type == '정기연습' ? Color['grey400'] : reservation?.participationAvailable ? Color['blue500'] : Color['red500'] }, reservation?.type == '정기연습' ? { backgroundColor: Color['grey100'] } : !reservation?.participationAvailable && { backgroundColor: Color['red100'] }]}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation?.type == '정기연습' ? { color: Color['grey400'] } : reservation?.participationAvailable ? { color: Color['blue300'] } : { color: Color['red600'] }]}>
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
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ height: 16, width: 16, backgroundColor: Color['grey300'] }} />
                            <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey300'] }}>초기화</Text>
                        </Pressable>
                    </View>

                    <View style={{ height: 16 }} />

                    <Pressable style={{ marginHorizontal: 16 }}>
                        {reservation && reservation?.participators?.length > 0 ?
                            <View style={{ alignItems: 'center', justifyContent: 'flex-end', borderRadius: 10, height: 72, backgroundColor: Color['grey200'] }}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', width: 120, marginLeft: 24, bottom: 8 }}>
                                        {reservation.participators.slice(0, 4).map(user => (user.profileImageUrl ? <Image
                                            source={{ uri: user.profileImageUrl }} style={{ width: 42, height: 56, }} /> : <View style={{ width: 42, height: 56, backgroundColor: Color['grey300'], borderWidth: 0.5, marginLeft: -4 * reservation.participators.length, borderRadius: 5 }} />))}
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', width: 152, bottom: 12 }}>

                                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'] }}>
                                            {reservation.participators.slice(0, 2).map(user => `${user.name} `)}{reservation.participators.length >= 3 && `등`}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                            <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Bold', color: Color['blue500'] }}>
                                                {reservation.participators.length}
                                            </Text>
                                            <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700'] }}>
                                                {`  명`}
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

                {/* <View style={{ marginHorizontal: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>대여 악기</Text>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
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

                <View style={{ height: 16 }} /> */}
            </ScrollView>
            {loginUser?.email == reservation?.email && reservation?.email && <View style={{ paddingVertical: 8, bottom: 0 }}>
                <LongButton
                    color={'green'}
                    innerText={'수정하기'}
                    isAble={true}
                    onPress={() => {
                        navigation.push('Reservation')
                    }}
                />
            </View>}
        </View>
    )
}


export default ReservationDetailScreen