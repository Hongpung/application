import { Pressable, ScrollView, Text, TextInput, View, Image, ActivityIndicator, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Color } from '@hongpung/ColorSet'
import LongButton from '@hongpung/components/buttons/LongButton'
import { loginUserState } from '@hongpung/recoil/authState'
import { useRecoilValue } from 'recoil'
import { getToken } from '@hongpung/utils/TokenHandler'
import { Reservation, parseToReservation } from '../ReserveInterface'
import { Icons } from '@hongpung/components/Icon'
import Toast from 'react-native-toast-message'
import { ReservationStackParamList } from '@hongpung/nav/ReservationStack'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

const { width } = Dimensions.get('window')


type ReservationDetailProps = NativeStackScreenProps<ReservationStackParamList, 'ReservationDetail'>

const ReservationDetailScreen: React.FC<ReservationDetailProps> = ({ navigation, route }) => {

    const { reservationId } = route.params

    const loginUser = useRecoilValue(loginUserState)

    const daysOfWeek = useMemo(() => ['일', '월', '화', '수', '목', '금', '토'], [])
    const [reservation, setReservation] = useState<Reservation | null>(null)
    const [isLoading, setLoading] = useState(false);
    const isEditible = () => {
        if (reservation) {
            const utcTime = new Date();
            const koreaTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);
            const limitTime = new Date(new Date(reservation?.date!).getTime() - 2 * 60 * 60 * 1000)
            return koreaTime <= limitTime
        }
        return false;
    }
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

                const parsedReservation = parseToReservation(loadedReservation)

                setReservation(parsedReservation)
            } catch (e) {
                console.error(e);
                navigation.goBack()
            } finally {
                setLoading(false);
                clearTimeout(timeoutId);
            }

        }
        load();
    }, [reservationId])

    const onDelete = () => {
        const deleteReservation = async () => {
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {
                setLoading(true);
                const token = await getToken('token');
                if (!token) throw Error('token is not valid')
                const response = await fetch(`${process.env.BASE_URL}/reservation/${reservationId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
                        },
                        signal
                    }
                )

                if (!response.ok) throw Error('삭제 실패' + response.status)

                Toast.show({
                    type: 'success',
                    text1: '연습 삭제를 완료했어요!',
                    position: 'bottom',
                    bottomOffset: 60,
                    visibilityTime: 2000
                });

                navigation.goBack();
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
                clearTimeout(timeoutId);
            }

        }

        deleteReservation();
    }
    const TimeGapText = useMemo(() => {
        const eTime = Number(reservation?.Time.endTime.toString().slice(5, 7)) * 60 + Number(reservation?.Time.endTime.toString().slice(7));
        const sTime = Number(reservation?.Time.startTime.toString().slice(5, 7)) * 60 + Number(reservation?.Time.startTime.toString().slice(7));

        const timeGap = eTime - sTime;

        const hourGap = timeGap / 60;
        const minnuteGap = timeGap % 60;

        return `${hourGap > 0.5 ? `${Math.floor(hourGap)}시간` : ''}${minnuteGap > 0 && hourGap > 0.5 ? `\n` : ''}${minnuteGap > 0 ? `${minnuteGap}분` : ''}`
    }, [reservation])

    const DateString = useCallback((selectedDate: Date) => {
        return `${selectedDate.getFullYear()}.${(selectedDate.getMonth() + 1)}.${selectedDate.getDate()}(${daysOfWeek[selectedDate.getDay()]})`
    }, [])

    if (isLoading || reservation == null)
        return (
            <View style={{ backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <ActivityIndicator color={Color['blue500']} size={'large'} />
            </View>)

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <ScrollView>
                <View style={{ height: 24 }} />
                <Text style={{ marginHorizontal: 24, fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약 일시</Text>
                <View style={{ height: 16 }} />
                <View style={{ height: 100, marginHorizontal: 40, backgroundColor: Color['grey100'], borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 8, alignItems: 'center' }}>
                        <View style={{ height: 24, width: 24, marginRight: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                            <Icons name='calendar-outline' size={20} color={Color['grey400']} />
                        </View>
                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', color: Color['grey700'] }}>{reservation.date && DateString(new Date(reservation.date))}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>{`${reservation.Time.startTime.toString().slice(5, 7)}:${reservation.Time.startTime.toString().slice(7)}`}</Text>
                        <View style={{ width: 64, paddingVertical: 8, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 5 }}>
                            <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Light', textAlign: 'center', color: Color['grey700'] }}>{TimeGapText}</Text>
                        </View>
                        <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'] }}>{`${reservation.Time.endTime.toString().slice(5, 7)}:${reservation.Time.endTime.toString().slice(7)}`}</Text>
                    </View>
                </View>

                <View style={{ height: 28 }} />

                <View style={{ height: 16, backgroundColor: Color['grey100'] }}></View>

                <View style={{ height: 28 }} />

                <View style={{ marginHorizontal: 24, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약자</Text>
                    <Text style={{ marginHorizontal: 12, paddingVertical: 4, fontSize: 16, textAlign: 'right' }}>{reservation.userName}</Text>
                </View>

                <View style={{ height: 24 }} />

                <View style={{ marginHorizontal: 24, flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약명</Text>
                    <Text style={{ marginHorizontal: 12, paddingVertical: 4, fontSize: 16, textAlign: 'right' }}>{reservation.reservationName}</Text>
                </View>

                <View style={{ height: 24 }} />

                <Text style={{ marginHorizontal: 24, fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>예약유형</Text>

                <View style={{ height: 24 }} />

                <View style={{ marginHorizontal: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>정규 연습</Text>
                    <View style={{ width: 218, height: 36, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[{ width: 108, alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0.5, borderColor: reservation.isRegular ? Color['blue500'] : Color['red500'] }, reservation.isRegular && { backgroundColor: Color['blue100'] }]}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation.isRegular ? { color: Color['blue600'] } : { color: Color['red300'] }]}>
                                예
                            </Text>
                        </View>
                        <View style={[{ width: 108, alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderLeftWidth: 0.5, borderColor: reservation.isRegular ? Color['blue500'] : Color['red500'] }, !reservation.isRegular && { backgroundColor: Color['red100'] }]}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation.isRegular ? { color: Color['blue300'] } : { color: Color['red600'] }]}>
                                아니오
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 20 }} />

                <View style={{ marginHorizontal: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>열린 연습</Text>
                    <View style={{ width: 218, height: 36, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[{ width: 108, alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0.5, borderColor: reservation.isRegular ? Color['grey400'] : reservation.isParticipatible ? Color['blue500'] : Color['red500'] }, !reservation.isRegular && reservation.isParticipatible && { backgroundColor: Color['blue100'] }]}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation.isRegular ? { color: Color['grey300'] } : reservation.isParticipatible ? { color: Color['blue600'] } : { color: Color['red300'] }]}>
                                예
                            </Text>
                        </View>
                        <View style={[{ width: 108, alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5, height: 36, justifyContent: 'center', borderWidth: 1, borderLeftWidth: 0.5, borderColor: reservation.isRegular ? Color['grey400'] : reservation.isParticipatible ? Color['blue500'] : Color['red500'] }, reservation.isRegular ? { backgroundColor: Color['grey100'] } : !reservation.isParticipatible && { backgroundColor: Color['red100'] }]}>
                            <Text style={[{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14 }, reservation.isRegular ? { color: Color['grey400'] } : reservation.isParticipatible ? { color: Color['blue300'] } : { color: Color['red600'] }]}>
                                아니오
                            </Text>
                        </View>
                    </View>
                </View>


                <View style={{ height: 24 }} />

                <View style={{ height: 16, backgroundColor: Color['grey100'] }}></View>

                <View style={{ height: 24 }} />

                <View style={{ marginHorizontal: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>참여자</Text>
                    </View>

                    <View style={{ height: 16 }} />

                    <Pressable style={{ marginHorizontal: 16 }}
                        onPress={() => reservation.participants.length > 0 && navigation.push('ReservationParticipatorsView', { participators: JSON.stringify(reservation.participants) })}>
                        {reservation.participants.length > 0 ?
                            <View style={{ justifyContent: 'flex-end', borderRadius: 10, height: 72, backgroundColor: Color['grey200'] }}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', flex: 1, marginLeft: 24, bottom: 8 }}>
                                        {reservation.participants.slice(0, 4).map(user => (user.profileImageUrl ? <Image
                                            source={{ uri: user.profileImageUrl }} style={{ width: 42, height: 56, }} /> : <View style={{ width: 42, height: 56, backgroundColor: Color['grey300'], borderWidth: 0.5, marginLeft: -6 * Math.min(reservation.participants.length, 4), borderRadius: 5 }} />))}
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', flex: 1, bottom: 12, gap: 8, paddingHorizontal: 12 }}>

                                        <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'] }} numberOfLines={1}>
                                            {reservation.participants.slice(0, 2).map(user => `${user.name}`).filter(Boolean).join(', ')}{reservation.participants.length >= 3 && `등`}
                                        </Text>

                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
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
                                <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'] }}>추가 참여자가 없습니다...</Text>
                            </View>}
                    </Pressable>
                </View>

                <View style={{ height: 32 }} />

                <View style={{ marginHorizontal: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey500'] }}>대여 악기</Text>
                    </View>

                    <View style={{ height: 16 }} />

                    <View style={{ marginHorizontal: 16 }}>
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
                                <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'] }}>대여 악기가 없습니다...</Text></View>
                        }
                    </View>
                </View>

                <View style={{ height: 24 }} />
                {isEditible() && loginUser?.email == reservation.userEmail && reservation.date! > new Date() && <View style={{ paddingVertical: 8, bottom: 0 }}>
                    <LongButton
                        color={'red'}
                        innerText={'취소하기'}
                        isAble={true}
                        onPress={() => {
                            if (!isEditible()) { alert('변경 가능 시간이 종료되었습니다.'); return }
                            onDelete()
                        }}
                    />
                </View>}
            </ScrollView>
            {isEditible() && loginUser?.email == reservation.userEmail && reservation.date! > new Date() && <View style={{ paddingVertical: 8, bottom: 0 }}>
                <LongButton
                    color={'green'}
                    innerText={'수정하기'}
                    isAble={true}
                    onPress={() => {
                        if (!isEditible()) { alert('변경 가능 시간이 종료되었습니다.'); return }
                        navigation.push('ReservationStack', { screen: 'inReservation', params: { reservationId } })
                    }}
                />
            </View>}
        </View>
    )
}


export default ReservationDetailScreen