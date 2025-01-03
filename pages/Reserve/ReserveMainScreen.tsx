import { FlatList, StyleSheet, Text, View, Dimensions, Pressable, ActivityIndicator, AppState, AppStateStatus } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BlurView } from 'expo-blur';

import { Color } from '@hongpung//ColorSet'
import { Icons } from '@hongpung/components/Icon';

import { CompositeNavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { io } from 'socket.io-client';
import Toast from 'react-native-toast-message';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '@hongpung/nav/BottomNav';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';
import { RealtimeSession, ReservationSession } from './SessionTypes';
import { getToken } from '@hongpung/utils/TokenHandler';

const { width } = Dimensions.get('window');

type ReseveMainScreenNav = CompositeNavigationProp<
    NativeStackNavigationProp<MainStackParamList, 'Reservation'>
    , BottomTabNavigationProp<BottomTabParamList, 'Reserve'>>

type BlankCard = { nextReservationTime: string | null };
type ReservationCard = Session | BlankCard
type Session = RealtimeSession | ReservationSession


const ReserveMainScreen: React.FC = () => {

    const navigation = useNavigation<ReseveMainScreenNav>()
    const isFocusing = useIsFocused();

    const [isOnAir, setOnAir] = useState(false);
    const [isParticipatible, setParticipatible] = useState(false);
    const [registeredSessions, setRegisteredSessions] = useState<Session[] | null>(null)
    const [reservationCards, setReservationCards] = useState<ReservationCard[] | null>(null)
    const [slideToIndex, setSlideToIndex] = useState<number | null>(null)

    const cardViewRef = useRef<FlatList>(null)

    const TimetoDate = useCallback((time: string) => {
        const utcTime = new Date();
        const koreaTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);
        const today = koreaTime.toISOString().split('T')[0]

        return new Date(today + 'T' + time + '.000Z')
    }, [])

    const isOpen = () => {
        const utcTime = new Date();
        const koreaTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);
        return TimetoDate('08:00:00') <= koreaTime && TimetoDate('22:30:00') >= koreaTime
    }
    useEffect(() => {
        if (registeredSessions) {
            const utcTime = new Date();
            const koreaTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);
            const slideTo: { index: number | null } = { index: null }
            let onAir = false;
            const fetchReservationCards: ReservationCard[] = []
            registeredSessions.map((session, index) => {
                if (session.sessionType == 'RESERVED') {
                    console.log(session.onAir)
                    if (session.onAir) {
                        onAir=true
                        setParticipatible(session.participationAvailable)
                    }
                    const startTime = TimetoDate(session.startTime)
                    const endTime = TimetoDate(session.endTime)
                    if (endTime < koreaTime) console.log('종료 후') // 시간순에 따라 종료된 것이 먼저 출현
                    if (koreaTime < endTime && startTime < koreaTime) { //시간순에 따라 진행 중인 것이 그다음 출현
                        slideTo.index = index
                        setParticipatible(session.participationAvailable)
                    }
                    if (koreaTime < startTime) {                        //시간순에 따라 진행 전이 것이 그다음 출현
                        if (!slideTo.index) { //진행전 인것만 존재한다면 이전에 slideTo가 채워지지 않았으므로 따로 설정
                            slideTo.index = index
                            isOpen() && fetchReservationCards.push({ nextReservationTime: session.startTime })
                            // 제일 앞의 연습이지만 아직 시작하지 않았으므로 사용 가능하다는 문구 노출
                        }
                    }
                    if (index == 0) {
                        const timeGap: number = (TimetoDate(session.startTime).getTime() - TimetoDate('10:00:00').getTime()) / 1000 / 60
                        console.log('연습 게시 까지:' + Math.floor(timeGap / 60) + '시간' + timeGap % 60 + '분')
                        if (isOpen() && TimetoDate(session.startTime).getTime() - koreaTime.getTime() >= 30) {
                            fetchReservationCards.push({ nextReservationTime: '없음' })
                            slideTo.index = 0
                        }
                    }

                    fetchReservationCards.push(session)

                    if (!!registeredSessions[index + 1]) {
                        const timeGap: number = (TimetoDate(registeredSessions[index + 1].startTime).getTime() - TimetoDate(session.endTime).getTime()) / 1000 / 60
                        console.log('다음 연습시간 까지:' + Math.floor(timeGap / 60) + '시간' + timeGap % 60 + '분')
                    } else {
                        console.log('다음 연습시간 없음')
                        // 다음 연습이 없는데 22시 이전이면 항시 사용가능 문구 노출
                        if (isOpen() && koreaTime <= TimetoDate('22:00:00'))
                            slideTo.index = index + 1
                        fetchReservationCards.push({ nextReservationTime: '없음' })

                    }
                } if (session.sessionType == 'REALTIME') {
                    console.log(session.onAir)
                    
                    if (session.onAir) {
                        onAir=true
                        setParticipatible(session.participationAvailable)
                    }
                    fetchReservationCards.push(session)
                }
            })

            if (!slideTo.index && fetchReservationCards.length > 1) {
                slideTo.index = fetchReservationCards.length - 1;
            }
            setReservationCards(fetchReservationCards);
            setOnAir(onAir)
            if (slideTo.index)
                setSlideToIndex(slideTo.index);
            else
                setSlideToIndex(0);
        }
    }, [registeredSessions])

    useEffect(() => {
        if (!!registeredSessions && !!reservationCards && !!slideToIndex) {
            if (slideToIndex < reservationCards.length)
                cardViewRef.current?.scrollToIndex({ index: slideToIndex, animated: true });
        }

    }, [registeredSessions, reservationCards, slideToIndex])


    const socketRef = useRef<any>(null); // 소켓 참조를 저장할 useRef

    useEffect(() => {
        const connectSocket = async () => {
            if (socketRef.current) {
                socketRef.current.disconnect(); // 기존 소켓 연결 해제
            }
            const token = await getToken('token')
            const socket = io(`${process.env.SUB_API}/reservation`, {
                transports: ['websocket'],
                reconnection: true,
                auth: { token }
            });

            socket.on('connect', () => {
                console.log('Connected to WebSocket Gateway');
                console.log('예약 메인 페이지 연결됨')
            });

            socket.on('reservationsFetched', (data) => {
                const loadReservations = JSON.parse(data) as Session[];
                console.log('Reservations Updated:', loadReservations);
                setRegisteredSessions(loadReservations);
            });

            socket.on('connect_error', (error) => {
                Toast.show({
                    type: 'error',
                    text1: error.message,
                    position: 'bottom',
                    bottomOffset: 60,
                    visibilityTime: 3000,
                });
            });

            socket.on('disconnect', (reason) => {
                console.log('Disconnected:', reason);
            });

            socketRef.current = socket; // 소켓 참조 업데이트
        };

        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && isFocusing) {
                console.log('App is active');
                connectSocket(); // 페이지 활성화 시 소켓 재연결
            } else {
                console.log('App is not active');
                if (socketRef.current) {
                    socketRef.current.disconnect(); // 페이지 비활성화 시 소켓 해제
                }
            }
        };

        if (isFocusing)
            connectSocket();

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            // 컴포넌트 언마운트 시 소켓 해제 및 이벤트 리스너 제거
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            subscription.remove();
        };
    }, [isFocusing]);

    // useEffect(() => {

    //     const socket = io(`${process.env.SUB_API}/reservation`, {
    //         transports: ['websocket'],
    //         reconnection: true,
    //     });

    //     socket.on('connect', () => {
    //         console.log('Connected to WebSocket Gateway');
    //         socket.emit('fetchReservations');
    //     });

    //     socket.on('reservationsUpdate', (data) => {
    //         const loadreservations = JSON.parse(data) as ReservationDTO[]
    //         console.log(data)
    //         setReservations(loadreservations);
    //     });

    //     socket.on('connect_error', (error) => {
    //         Toast.show({
    //             type: 'error',
    //             text1: error.title,
    //             position: 'bottom',
    //             bottomOffset: 60,
    //             visibilityTime: 3000
    //         });
    //     });

    //     socket.on('disconnect', (reason) => {
    //         console.log('Disconnected:', reason);
    //     });

    //     return () => {
    //         socket.disconnect();
    //     };
    // }, [])

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

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1 }}>
            <View style={{ marginTop: 224 }}>
                <View style={{ flexDirection: 'row', marginHorizontal: 32, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 20 }}>연습실 이용상태</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {isOnAir && isParticipatible && <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['green500'], backgroundColor: Color['green200'], borderRadius: 5, padding: 6 }}>참여가능</Text>}
                        {isOnAir ?
                            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['red500'], backgroundColor: Color['red100'], borderRadius: 5, padding: 6, marginLeft: 4 }}>사용중</Text> :
                            isOpen() ? <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['blue500'], backgroundColor: Color['blue100'], borderRadius: 5, padding: 6, marginLeft: 4 }}>사용 가능</Text> :
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['grey500'], backgroundColor: Color['grey100'], borderRadius: 5, padding: 6, marginLeft: 4 }}>연습실 종료</Text>}
                    </View>
                </View>
                <View style={{ height: 12 }} />
                {reservationCards && (registeredSessions?.length == 0 ?
                    <View style={{ alignSelf: 'center', height: 200, borderWidth: 1, borderColor: Color['grey200'], borderRadius: 10, marginHorizontal: 6, width: width - 48, gap: 8, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', marginHorizontal: 64, color: Color['grey700'], textAlign: 'center', fontSize: 16 }}>
                            {`오늘 예정된 예약이 없어요`}
                        </Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'], textAlign: 'center' }}>
                            {`지금 연습실에 가면 바로 이용이 가능해요!`}</Text>
                        <View style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                            <Pressable style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 12, marginHorizontal: 60, borderWidth: 1, borderColor: Color['grey200'], borderRadius: 25, }}
                                onPress={() => navigation.navigate('QRScan')}>
                                <Text numberOfLines={1} style={{ color: Color['grey400'], fontFamily: 'NanumSquareNeo-Regular', textAlign: 'left', fontSize: 14 }}>
                                    QR 스캔해서 사용하기
                                </Text>
                                <Icons name='chevron-forward' size={20} color={Color['grey300']} style={{ marginRight: -8 }} />
                            </Pressable>
                        </View>
                    </View>
                    :
                    <FlatList
                        ref={cardViewRef}
                        contentContainerStyle={{ position: 'relative', alignItems: 'center' }}
                        data={reservationCards}
                        horizontal
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => item && ((item?.reservationName || 'false') + index)}
                        snapToInterval={width - 28}
                        snapToAlignment="center"
                        decelerationRate="fast"
                        onScrollToIndexFailed={(info) => {
                            //로딩이 다 안됐는데 스크롤 입력이 들어올 경우 타임 아웃으로 로딩 시간 확보
                            console.warn('Scroll to index failed:', info);
                            setTimeout(() => {
                                cardViewRef.current?.scrollToIndex({
                                    index: info.index,
                                    animated: false,
                                });
                            }, 100);
                        }}
                        renderItem={({ item, index }) => {

                            const isPlayed = item?.onAir || false;
                            const color = item?.reservationType == '정규연습' ? 'blue' : item.participationAvailable ? 'green' : 'red';

                            if (!!item?.nextReservationTime) {
                                if (isOnAir) return null
                                return (
                                    <View key={item.title + index} style={[{ marginVertical: 8, height: 200, borderWidth: 1, backgroundColor: '#FFF', borderColor: Color['grey200'], borderRadius: 10, marginHorizontal: 8 }, { width: width - 48 }]}>

                                        <Text numberOfLines={1} style={{ fontFamily: 'NanumSquareNeo-Bold', marginHorizontal: 64, top: 72, textAlign: 'center', fontSize: 20 }}>
                                            즉시 이용 가능해요
                                        </Text>
                                        <View style={{ top: 80, width: '100%', display: 'flex', alignItems: 'center' }}>
                                            <Pressable style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 12, marginHorizontal: 60, borderWidth: 1, borderColor: Color['grey200'], borderRadius: 25, }}
                                                onPress={() => navigation.navigate('QRScan')}>
                                                <Text numberOfLines={1} style={{ color: Color['grey400'], fontFamily: 'NanumSquareNeo-Regular', textAlign: 'left', fontSize: 14 }}>
                                                    QR 스캔해서 사용하기
                                                </Text>
                                                <Icons name='chevron-forward' size={20} color={Color['grey300']} style={{ marginRight: -8 }} />
                                            </Pressable>
                                        </View>

                                        <View style={{ position: 'absolute', right: 24, bottom: 24, alignItems: 'flex-end' }}>
                                            <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>다음 연습 시간: {item.nextReservationTime == '없음' ? '없음' : item.nextReservationTime.slice(0, -3)}</Text>
                                        </View>
                                    </View>
                                )
                            }
                            return (
                                <View>
                                    {isPlayed &&
                                        <View style={{ position: 'absolute', borderRadius: 10, height: '100%', width: width - 32, overflow: 'hidden' }}>
                                            <View style={{ position: 'absolute', borderRadius: 10, height: '100%', width: width - 32, overflow: 'hidden', backgroundColor: Color[`${color}100`] }} />
                                            <View style={{ position: 'absolute', left: 6, top: 6, borderRadius: 10, height: 204, width: width - 44, overflow: 'hidden', backgroundColor: Color[`${color}500`] }} />
                                            <BlurView intensity={10} tint='default' style={{ borderRadius: 10, height: '100%', width: width - 32, overflow: 'hidden', }} />
                                        </View>
                                    }

                                    {item.sessionType == 'RESERVED' ?
                                        <Pressable key={item.sessionId + index} style={[{ marginVertical: 8, height: 200, borderWidth: 1, backgroundColor: '#FFF', borderColor: Color['grey200'], borderRadius: 10, marginHorizontal: 8 }, { width: width - 48 }]}
                                            onPress={() => {
                                                navigation.push('Reservation', { screen: 'ReservationDetail', params: { reservationId: item.reservationId } })
                                            }}>
                                            {item.reservationType == '정규연습' ?
                                                <View style={{ position: 'absolute', height: 56, width: 48, right: 20, top: -4, }} >
                                                    <Icons size={52} name={'bookmark-sharp'} color={Color['blue500']} />
                                                </View>
                                                :
                                                <View style={{ position: 'absolute', right: 20, top: 24, alignItems: 'flex-end' }}>
                                                    <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 16, color: Color['grey700'] }}>{item.creatorName}</Text>
                                                    {item.creatorNickname && <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 12, color: Color['grey400'] }}>{item.creatorNickname}</Text>}
                                                </View>
                                            }
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontFamily: 'NanumSquareNeo-Bold', marginHorizontal: 64, top: 72, textAlign: 'center', fontSize: 20 }}>{item.title}</Text>
                                            <View style={{ position: 'absolute', right: 24, bottom: 12, alignItems: 'flex-end', gap: 4 }}>
                                                <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>{`${item.startTime} ~ ${item.endTime}`}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Icons size={24} name={'people'} color={Color['grey300']} />
                                                    <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>
                                                        {item.participators.length}
                                                    </Text>
                                                </View>
                                            </View>
                                        </Pressable>
                                        :
                                        //여기는 실시간 생성 세션
                                        <View key={item.sessionId + index} style={[{ marginVertical: 8, height: 200, borderWidth: 1, backgroundColor: '#FFF', borderColor: Color['grey200'], borderRadius: 10, marginHorizontal: 8 }, { width: width - 48 }]}>
                                            {
                                                <View style={{ position: 'absolute', right: 20, top: 24, alignItems: 'flex-end' }}>
                                                    <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 16, color: Color['grey700'] }}>{item.creatorName}</Text>
                                                    {item.creatorNickname && <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 12, color: Color['grey400'] }}>{item.creatorNickname}</Text>}
                                                </View>
                                            }
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontFamily: 'NanumSquareNeo-Bold', marginHorizontal: 64, top: 72, textAlign: 'center', fontSize: 20 }}>{item.title}</Text>
                                            <View style={{ position: 'absolute', right: 24, bottom: 12, alignItems: 'flex-end', gap: 4 }}>
                                                <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>{`${item.startTime.slice(0, -3)} ~ ${item.endTime.slice(0, -3)}`}</Text>
                                                <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>
                                                    실시간 예약
                                                </Text>
                                            </View>
                                        </View>
                                    }
                                </View>
                            )
                        }}
                        ListHeaderComponent={() => {
                            return (<View style={{ width: 12 }} />)
                        }}
                        ListFooterComponent={() => {
                            return (<View style={{ width: 12 }} />)
                        }}
                    />)}
            </View>
            <View style={{ position: 'absolute', bottom: 92, marginHorizontal: 24, height: 92, flexDirection: 'row', justifyContent: 'space-between', width: width - 48 }}>
                <Pressable style={{ width: (width - 48) / 2 - 4, borderWidth: 1, borderColor: Color['grey200'], borderRadius: 10 }}
                    onPress={() => navigation.push('Reservation')}>
                    <Text style={{ position: 'absolute', left: 8, bottom: 8, fontSize: 16, fontFamily: 'NanumSquareNeo-Heavy', color: Color['grey700'] }}>연습실 예약 조회</Text>
                </Pressable>
                <Pressable style={{ width: (width - 48) / 2 - 4, backgroundColor: Color['grey400'], borderRadius: 10 }}
                    onPress={() => { }}>
                    <Text style={{ position: 'absolute', right: 8, top: 8, fontSize: 16, fontFamily: 'NanumSquareNeo-Heavy', color: '#FFF' }}>활동 조회</Text>
                </Pressable>
            </View>
            {!registeredSessions &&
                <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <ActivityIndicator size={'large'} color={'#FFF'} />
                </View>}
        </View>
    )
}

export default ReserveMainScreen

const styles = StyleSheet.create({})