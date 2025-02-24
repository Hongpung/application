import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import { debounce } from 'lodash'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Color } from '@hongpung/ColorSet';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loginUserState, TodayReservation, todayReservations } from '@hongpung/recoil/authState';
import { Icons } from '../../src/common/components/icons/Icon';
import { BlurView } from 'expo-blur';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { NotificationIcon } from './NotificationIcon';
import { getToken } from '@hongpung/src/common/lib/TokenHandler';

const { width } = Dimensions.get('window')


type TodayScheduleNavParams = NativeStackNavigationProp<MainStackParamList, 'Home'>

const TodaySchedule: React.FC = () => {

    const navigation = useNavigation<TodayScheduleNavParams>();

    const isFocusing = useIsFocused();
    const loginUser = useRecoilValue(loginUserState);

    const [todayReservationsData, setTodayReservations] = useRecoilState(todayReservations);

    const loadTodayReservations = () => {
        const fetchReservations = async () => {
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {

                const token = await getToken('token');

                const todayReservations = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/reservation/today`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    signal
                })

                if (!todayReservations.ok) throw Error('오늘 예약 불러오기 실패')

                const loadedReservations = await todayReservations.json() as TodayReservation[]

                setTodayReservations(prev => ({ ...prev, todayReservations: [...loadedReservations] }))

            } catch (e) {
                console.error(e);
                // navigation.dispatch(StackActions.replace('Login'))
            } finally {
                clearTimeout(timeoutId);
            }
        }

        fetchReservations();
    }

    const navigateToReservation = debounce(() => {
        navigation.navigate('Reservation')
    }, 50);

    useEffect(() => {
        if (isFocusing) {
            const today = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
            if (today != todayReservationsData.date) {
                loadTodayReservations();
            }
        }
    }, [isFocusing])

    return (
        <View style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 24 }}>
                <View style={styles.textRow}>
                    <Text style={styles.dateText}>{todayReservationsData.date.split('-')[0]}년 {todayReservationsData.date.split('-')[1]}월 {todayReservationsData.date.split('-')[2]}일</Text>
                    <Text style={styles.greetingText}>{loginUser?.nickname || loginUser?.name}님, {todayReservationsData.todayReservations.length > 0 ? '오늘 예약이 있어요!' : `안녕하세요!`}</Text>
                </View>
                <NotificationIcon />
            </View>
            <View style={[styles.ScheduleContainer,
            todayReservationsData.todayReservations.length > 0 ?
                {
                    borderColor: Color['blue500'],
                    backgroundColor: Color['blue500']
                }
                :
                {
                    borderWidth: 4,
                    borderColor: Color['grey300'],
                    borderStyle: 'dashed'
                }
            ]}
            >
                {
                    todayReservationsData.todayReservations.length > 0 ?
                        <View style={{ display: 'flex', gap: 4 }} >{
                            todayReservationsData.todayReservations.map((reservation, index) => {
                                return (
                                    <ReservationCardComponent key={reservation.reservationId} todayReservation={reservation} />
                                )
                            })
                        }
                            {/* <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14 }}>오늘의 일정이 있어요</Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: '#FFF', fontSize: 18 }}>예약 확인하러 가기</Text> */}
                        </View > :
                        <TouchableOpacity activeOpacity={0.95} style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}
                            onPress={() => {
                                navigateToReservation()
                            }}>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey500'], fontSize: 18 }}>오늘의 일정이 없어요</Text>
                            <Text style={{ fontFamily: 'NanumSquareNeo-ExtraBold', color: Color['grey300'], fontSize: 14 }}>새로운 일정 예약하러 가기</Text>
                        </TouchableOpacity>}
            </ View>
        </View>

    )
}


export default TodaySchedule



export const ReservationCardComponent: React.FC<{ todayReservation: TodayReservation }> = ({ todayReservation }) => {

    const navigation = useNavigation<TodayScheduleNavParams>();

    const loginUser = useRecoilValue(loginUserState);
    todayReservation?.reservationType == 'REGULAR' ?
        'blue'
        :
        todayReservation.participationAvailable ?
            'green'
            :
            'red';

    return (
        <View style={{ width: '100%', height: 156, borderRadius: 10, overflow: 'hidden' }}>
            <Pressable key={todayReservation.reservationId} style={[{ height: '100%', borderWidth: 1, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#FFF', borderColor: Color['grey200'], borderRadius: 10, width: '100%' }]}
                onPress={() => {
                    navigation.push('Reservation', { screen: 'ReservationDetail', params: { reservationId: todayReservation.reservationId } })
                }}>
                {todayReservation.reservationType == 'REGULAR' || todayReservation.creatorId == loginUser?.memberId ?
                    <Svg height="100%" width="100%" style={[StyleSheet.absoluteFill, { opacity: 0.6 }]}>
                        <Defs>
                            <RadialGradient
                                id="grad"
                                cx="40%"  // 그라디언트의 중심 x 좌표
                                cy="120%"  // 그라디언트의 중심 y 좌표 
                                rx="50%"  // x축 반지름
                                ry="70%"  // y축 반지름
                                fx="40%"  // 초점의 x 좌표
                                fy="120%"  // 초점의 y 좌표
                                gradientUnits="userSpaceOnUse" // 그라디언트 범위를 사용자 지정 단위로 설정
                            >
                                <Stop offset="0%" stopColor="#8048F5" />
                                <Stop offset="60%" stopColor="#64C2F7" />
                                <Stop offset="100%" stopColor="#FFFFFF" />
                            </RadialGradient>
                        </Defs>
                        <Rect width="100%" height="100%" fill="url(#grad)" />
                    </Svg>
                    :
                    <Svg height="100%" width="100%" style={[StyleSheet.absoluteFill, { opacity: 0.6 }]}>
                        <Defs>
                            <RadialGradient
                                id="grad"
                                cx="40%"  // 그라디언트의 중심 x 좌표
                                cy="120%"  // 그라디언트의 중심 y 좌표 
                                rx="50%"  // x축 반지름
                                ry="70%"  // y축 반지름
                                fx="40%"  // 초점의 x 좌표
                                fy="120%"  // 초점의 y 좌표
                                gradientUnits="userSpaceOnUse" // 그라디언트 범위를 사용자 지정 단위로 설정
                            >
                                <Stop offset="0%" stopColor="#5BBF88" />
                                <Stop offset="60%" stopColor="#B2CF82" />
                                <Stop offset="100%" stopColor="#FFFFFF" />
                            </RadialGradient>
                        </Defs>
                        <Rect width="100%" height="100%" fill="url(#grad)" />
                    </Svg>
                }
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20 }}>
                    <View style={{
                        flexDirection: 'row', paddingTop: 14, gap: 4
                    }}>
                        {
                            todayReservation.reservationType == 'REGULAR' ?
                                <>
                                    <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['blue500'] }}>
                                        정규 연습
                                    </Text>
                                    <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['grey800'] }}>
                                        |
                                    </Text>
                                    <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>
                                        {Number(todayReservation.date.split('-')[1])}월 {Number(todayReservation.date.split('-')[2])}일
                                    </Text>
                                </>
                                :
                                todayReservation.creatorId == loginUser?.memberId ?
                                    <>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['blue500'] }}>
                                            내가 만든 일정
                                        </Text>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['grey800'] }}>
                                            |
                                        </Text>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>
                                            {Number(todayReservation.date.split('-')[1])}월 {Number(todayReservation.date.split('-')[2])}일
                                        </Text>
                                    </>
                                    :
                                    <>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['green500'] }}>
                                            참가하는 일정
                                        </Text>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 14, color: Color['grey800'] }}>
                                            |
                                        </Text>
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>
                                            {Number(todayReservation.date.split('-')[1])}월 {Number(todayReservation.date.split('-')[2])}일
                                        </Text>
                                    </>
                        }
                    </View>
                    {/* <Text style={{
                        fontFamily: 'NanumSquareNeo-Bold',
                        paddingTop: 14,
                        fontSize: 14,
                        color: todayReservation.creatorId == loginUser?.memberId ? Color['blue500'] : Color['green500']
                    }}>
                        {todayReservation.creatorId == loginUser?.memberId ? '내가 만든 일정' : '참가하는 일정'}
                    </Text> */}
                    {/* 동아리 개별 연습 유형 */
                        todayReservation.reservationType == 'REGULAR' ?
                            <View style={{
                                width: 48, height: 48, marginTop: -4
                            }} >
                                <Icons name="bookmark-sharp" size={48} color={Color['blue500']} />
                            </View>
                            :
                            <View style={{ paddingTop: 16, flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Text style={{
                                    textAlign: 'right',
                                    fontFamily: 'NanumSquareNeo-Regular',
                                    fontSize: 16,
                                    color: Color['grey600']
                                }}>
                                    {todayReservation.creatorName}
                                </Text>
                                <View style={{ height: 4 }} />
                                {todayReservation.creatorNickname &&
                                    <Text style={{
                                        textAlign: 'right',
                                        fontFamily: 'NanumSquareNeo-Regular',
                                        fontSize: 12,
                                        color: Color['grey400']
                                    }}>{todayReservation.creatorNickname}
                                    </Text>
                                }
                            </View>
                    }
                </View>

                <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontFamily: 'NanumSquareNeo-Bold', marginHorizontal: 64, textAlign: 'center', fontSize: 20 }}>{todayReservation.title}</Text>

                <View style={{ right: 24, bottom: 12, alignItems: 'flex-end', gap: 4 }}>
                    <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>{`${todayReservation.startTime} ~ ${todayReservation.endTime}`}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Icons size={24} name={'people'} color={Color['grey300']} />
                        <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>
                            {todayReservation.amountOfParticipators}
                        </Text>
                    </View>

                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    ScheduleContainer: {
        height: 156,
        borderRadius: 10,
    },
    textRow: {
        flexDirection: 'column',
        gap: 8,
        alignItems: 'flex-start',
        paddingHorizontal: 4
    },
    greetingText: {
        position: 'relative',
        textAlign: 'right',
        color: Color['grey800'],
        fontSize: 18,
        fontFamily: 'NanumSquareNeo-Bold'
    },
    dateText: {
        position: 'relative',
        color: Color['grey800'],
        fontSize: 14,
        fontFamily: 'NanumSquareNeo-Regular',
        lineHeight: 16,
    },
})