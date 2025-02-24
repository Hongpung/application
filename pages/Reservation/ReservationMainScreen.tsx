import { FlatList, StyleSheet, Text, View, Dimensions, Image, Pressable, ActivityIndicator, AppState, AppStateStatus, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BlurView } from 'expo-blur';

import { Color } from '@hongpung/ColorSet'
import { Icons } from '@hongpung/src/common/components/icons/Icon';

import { CompositeNavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { io } from 'socket.io-client';
import Toast from 'react-native-toast-message';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '@hongpung/nav/BottomNav';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';
import { RealtimeSession, ReservationSession } from './SessionTypes';
import { getToken } from '@hongpung/src/common/lib/TokenHandler';

const { width, height } = Dimensions.get('window');

type ResevationMainScreenNav = CompositeNavigationProp<
    NativeStackNavigationProp<MainStackParamList, 'Reservation'>
    , BottomTabNavigationProp<BottomTabParamList, 'Reservation'>
>

type BlankCard = { type: 'blank', nextReservationTime: string };

type SessionCard = {
    session: Session,
    type: 'session'
}
type ReservationCard = SessionCard | BlankCard

function isBlank(card: ReservationCard): card is BlankCard {
    return card.type === 'blank';
}

type Session = RealtimeSession | ReservationSession


const TimetoDate = (time: string): Date => {
    const utcTime = new Date();
    const koreaTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);
    const today = koreaTime.toISOString().split('T')[0]

    return new Date(today + 'T' + time + '.000Z')
}

const isOpen = (): boolean => {
    const utcTime = new Date();
    const koreaTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);
    return TimetoDate('08:00:00') <= koreaTime && TimetoDate('22:30:00') >= koreaTime
}

const BlankCardComponent: React.FC<{ nextReservationTime: string }> = ({ nextReservationTime }) => {

    const navigation = useNavigation<ResevationMainScreenNav>();

    return (
        <View style={[{ marginVertical: 8, height: 200, borderWidth: 1, backgroundColor: '#FFF', borderColor: Color['grey200'], borderRadius: 10, width: width - 48}]}>

            <Text numberOfLines={1} style={{ fontFamily: 'NanumSquareNeo-Bold', marginHorizontal: 64, top: 72, textAlign: 'center', fontSize: 20 }}>
                즉시 이용 가능해요
            </Text>

            <View style={{ top: 80, width: '100%', display: 'flex', alignItems: 'center' }}>

                <Pressable style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 12, marginHorizontal: 60, borderWidth: 1, borderColor: Color['grey200'], borderRadius: 25, }}
                    onPress={() => navigation.jumpTo('QRScan')}>

                    <Text numberOfLines={1} style={{ color: Color['grey400'], fontFamily: 'NanumSquareNeo-Regular', textAlign: 'left', fontSize: 14 }}>
                        QR 스캔해서 사용하기
                    </Text>

                    <Icons name='chevron-forward' size={20} color={Color['grey300']} style={{ marginRight: -8 }} />
                </Pressable>

            </View>

            <View style={{ position: 'absolute', right: 24, bottom: 24, alignItems: 'flex-end' }}>

                <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>다음 연습 시간: {nextReservationTime}</Text>

            </View>

        </View>
    )
}

const useSessionListSocket = (): Session[] => {
    const socketRef = useRef<any>(null); // 소켓 참조를 저장할 useRef

    const isFocusing = useIsFocused();
    const [sessionList, setSessionList] = useState<Session[] | null>(null)

    const connectSocket = async () => {
        if (socketRef.current) {
            socketRef.current.disconnect(); // 기존 소켓 연결 해제
        }

        const token = await getToken('token')

        const socket = io(`${process.env.EXPO_PUBLIC_BASE_URL}/reservation`, {
            transports: ['websocket'],
            reconnection: true,
            auth: { token }
        });

        socket.on('connect', () => {
            console.log('세션 리스트 연결됨')
        });

        socket.on('reservationsFetched', (data) => {
            const loadSessionList = JSON.parse(data) as Session[];
            console.log('Session-List Updated:', loadSessionList);
            setSessionList(loadSessionList);
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
                console.log('세션 리스트 연결 해제됨')
                socketRef.current.disconnect(); // 페이지 비활성화 시 소켓 해제
            }
        }
    };

    useEffect(() => {

        if (isFocusing)
            connectSocket();
        else if (socketRef.current) {
            console.log('세션 리스트 연결 해제됨')
            socketRef.current.disconnect(); // 페이지 비활성화 시 소켓 해제
        }

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            // 컴포넌트 언마운트 시 소켓 해제 및 이벤트 리스너 제거
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            subscription.remove();
        };

    }, [isFocusing]);


    return sessionList ?? [];
}


const useSessionListCards = (sessionList: Session[]) => {
    const [isOnAir, setOnAir] = useState(false);
    const [isParticipatible, setParticipatible] = useState(false);
    const [reservationCards, setReservationCards] = useState<ReservationCard[]>([])
    const [slideToIndex, setSlideToIndex] = useState<number | null>(null)
    const cardViewRef = useRef<FlatList>(null)

    useEffect(() => {
        const utcTime = new Date();
        const koreaTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);
        const slideTo: { index: number | null } = { index: null }
        const fetchReservationCards: ReservationCard[] = []

        setOnAir(false) // onAir 상태 초기화화

        sessionList.map((session, index) => {
            if (session.sessionType === 'RESERVED') {
                console.log('세션 정보:' + session.status)

                if (session.status == 'AFTER' || session.status == 'DISCARDED') {

                    //다음 세션이 존재한다면
                    if (!!sessionList[index + 1]) {
                        //세션만 노출
                        fetchReservationCards.push({ type: 'session', session })
                    } else {
                        fetchReservationCards.push({ type: 'session', session })
                        // 다음 연습이 없는데 22시 이전이면 항시 사용가능 문구 노출
                        if (isOpen() && koreaTime <= TimetoDate('22:00:00'))
                            slideTo.index = index + 1
                        fetchReservationCards.push({ type: 'blank', nextReservationTime: '없음' })

                    }
                }

                if (session.status === 'ONAIR') { //시간순에 따라 진행 중인 것이 그다음 출현

                    slideTo.index = index
                    setOnAir(true)
                    setParticipatible(session.participationAvailable)

                    fetchReservationCards.push({ type: 'session', session })

                    return;
                }

                if (session.status == 'BEFORE') {                        //시간순에 따라 진행 전이 것이 그다음 출현

                    //ONAIR가 없다면 BEFORE의 맨 앞이 다음 세션이므로 slideTo함
                    if (!slideTo.index) {

                        slideTo.index = index

                        //다음 세션 시작 40분 전의 경우 다음 세션의 자리에 blank 삽입 함
                        const utcTime = new Date()

                        //UTC단위 (KST +9) --now
                        const koreaTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);

                        // 한국 날짜
                        const date = koreaTime.toISOString().split('T')[0]

                        const sessionStartTime = new Date(`${date}T${session.startTime}Z`)

                        const timeGap = sessionStartTime.getTime() - koreaTime.getTime()

                        //현재 시간이 세션 시작 시간보다 40분넘게 남았다면
                        if (timeGap > 40 * 60 * 1000)
                            fetchReservationCards.push({ type: 'blank', nextReservationTime: session.startTime })

                    }
                    fetchReservationCards.push({ type: 'session', session })
                    // 제일 앞의 연습이지만 아직 시작하지 않았으므로 사용 가능하다는 문구 노출
                    return;
                }
            } if (session.sessionType == 'REALTIME') {

                fetchReservationCards.push({ type: 'session', session })
                if (session.status == 'ONAIR') {
                    setOnAir(true)
                    setParticipatible(session.participationAvailable)
                } else {
                    if (!sessionList[index + 1]) {
                        // 다음 연습이 없는데 22시 이전이면 항시 사용가능 문구 노출
                        if (isOpen() && koreaTime <= TimetoDate('22:00:00'))
                            slideTo.index = index + 1
                        fetchReservationCards.push({ type: 'blank', nextReservationTime: '없음' })

                    }
                }
            }
        })

        if (!slideTo.index && fetchReservationCards.length > 1) {
            slideTo.index = fetchReservationCards.length - 1;
        }
        setReservationCards(fetchReservationCards);
        if (slideTo.index)
            setSlideToIndex(slideTo.index);
        else
            setSlideToIndex(0);
    }, [sessionList])

    useEffect(() => {
        if (!!slideToIndex) {
            if (slideToIndex < reservationCards.length)
                cardViewRef.current?.scrollToIndex({ index: slideToIndex, animated: true });
        }

    }, [slideToIndex])


    return { isOnAir, isParticipatible, reservationCards, cardViewRef }

}

const SessionStatusBlock: React.FC<{ isOnAir: boolean, isParticipatible: boolean }> = ({ isOnAir, isParticipatible }) => {

    return (
        <View style={{ flexDirection: 'row', marginHorizontal: 32, justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 20 }}>연습실 이용상태</Text>
            <View style={{ flexDirection: 'row' }}>
                {isOnAir && isParticipatible && <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['green500'], backgroundColor: Color['green200'], borderRadius: 5, padding: 6 }}>참여가능</Text>}
                {isOnAir ?
                    <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['red500'], backgroundColor: Color['red100'], borderRadius: 5, padding: 6, marginLeft: 4 }}>사용중</Text>
                    :
                    isOpen() ?
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['blue500'], backgroundColor: Color['blue100'], borderRadius: 5, padding: 6, marginLeft: 4 }}>사용 가능</Text>
                        :
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['grey500'], backgroundColor: Color['grey100'], borderRadius: 5, padding: 6, marginLeft: 4 }}>이용 불가</Text>}
            </View>
        </View>)
}

const SessionCardComponent: React.FC<{ session: Session }> = ({ session }) => {

    const navigation = useNavigation<ResevationMainScreenNav>();

    const isPlayed = session?.status == 'ONAIR' || false;
    const isAfter = session?.status == 'AFTER';
    const color = session.sessionType == 'RESERVED' && session?.reservationType == 'REGULAR' ?
        'blue'
        :
        session.participationAvailable ?
            'green'
            :
            'red';

    return (
        <View>
            <View>

                {
                isPlayed &&
                    <View style={{ position: 'absolute', borderRadius: 10, height: '100%', width: width }}>
                        <View style={{ position: 'absolute', borderRadius: 10, height: '100%', left:-6, width: width - 36, overflow: 'hidden', backgroundColor: Color[`${color}100`] }} />
                        <View style={{ position: 'absolute', left: -2, top: 6, borderRadius: 10, height: 204, width: width - 44, overflow: 'hidden', backgroundColor: Color[`${color}500`] }} />
                        <BlurView experimentalBlurMethod='dimezisBlurView' intensity={6} tint='default' style={{ borderRadius: 10, height: '100%', width: width - 32, left:-8, overflow: 'hidden', }} />
                    </View>
                }

                {session.sessionType == 'RESERVED' ?
                    <Pressable key={session.sessionId} style={[{ marginVertical: 8, height: 200, borderWidth: 1, backgroundColor: '#FFF', borderColor: Color['grey200'], borderRadius: 10, }, { width: width - 48 }]}
                        onPress={() => {
                            navigation.push('Reservation', { screen: 'ReservationDetail', params: { reservationId: session.reservationId } })
                        }}>

                        {session.reservationType == 'REGULAR' ?
                            <View style={{ position: 'absolute', height: 56, width: 48, right: 20, top: -4, }} >
                                <Icons size={52} name={'bookmark-sharp'} color={Color['blue500']} />
                            </View>
                            :
                            <View style={{ position: 'absolute', right: 20, top: 24, alignItems: 'flex-end' }}>
                                <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 16, color: Color['grey700'] }}>{session.creatorName}</Text>
                                {session.creatorNickname && <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 12, color: Color['grey400'] }}>{session.creatorNickname}</Text>}
                            </View>
                        }

                        {session.status == 'AFTER' ?
                            <View style={{ position: 'absolute', left: 12, bottom: 12, }} >
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['grey500'], backgroundColor: Color['grey100'], borderRadius: 5, padding: 6, marginLeft: 4 }}>종료됨</Text>
                            </View>
                            :
                            session.status == 'DISCARDED' &&
                            <View style={{ position: 'absolute', left: 12, bottom: 12, }} >
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['grey500'], backgroundColor: Color['grey100'], borderRadius: 5, padding: 6, marginLeft: 4 }}>종료됨</Text>
                            </View>
                        }

                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontFamily: 'NanumSquareNeo-Bold', marginHorizontal: 64, top: 72, textAlign: 'center', fontSize: 20, color: isAfter ? Color['grey400'] : 'black' }}>{session.title}</Text>

                        <View style={{ position: 'absolute', right: 24, bottom: 12, alignItems: 'flex-end', gap: 4 }}>
                            <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>{`${session.startTime} ~ ${session.endTime}`}</Text>
                            {session.reservationType != 'EXTERNAL' ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <Icons size={24} name={'people'} color={Color['grey300']} />
                                    <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>
                                        {session.participators.length}
                                    </Text>
                                </View>
                                :
                                <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>
                                    외부 인원 사용
                                </Text>
                            }
                        </View>
                    </Pressable>
                    :

                    //여기는 실시간 생성 세션
                    <View key={session.sessionId} style={[{ marginVertical: 8, height: 200, borderWidth: 1, backgroundColor: '#FFF', borderColor: Color['grey200'], borderRadius: 10 }, { width: width - 48 }]}>
                        {
                            <View style={{ position: 'absolute', right: 20, top: 24, alignItems: 'flex-end' }}>
                                <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 16, color: Color['grey700'] }}>{session.creatorName}</Text>
                                {session.creatorNickname && <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 12, color: Color['grey400'] }}>{session.creatorNickname}</Text>}
                            </View>
                        }
                        {session.status == 'AFTER' &&
                            <View style={{ position: 'absolute', left: 12, bottom: 12, }} >
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', fontSize: 12, color: Color['grey500'], backgroundColor: Color['grey100'], borderRadius: 5, padding: 6, marginLeft: 4 }}>종료됨</Text>
                            </View>}
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontFamily: 'NanumSquareNeo-Bold', marginHorizontal: 64, top: 72, textAlign: 'center', fontSize: 20, color: isAfter ? Color['grey400'] : 'black' }}>{session.title}</Text>
                        <View style={{ position: 'absolute', right: 24, bottom: 12, alignItems: 'flex-end', gap: 4 }}>
                            <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>{`${session.startTime.slice(0, -3)} ~ ${session.endTime.slice(0, -3)}`}</Text>
                            <Text style={{ textAlign: 'right', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>
                                실시간 예약
                            </Text>
                        </View>
                    </View>
                }
            </View>
        </View>
    )
}

const SessionListCards: React.FC<{ sessionList: Session[] }> = ({ sessionList }) => {

    const navigation = useNavigation<ResevationMainScreenNav>();

    const { isOnAir, isParticipatible, reservationCards, cardViewRef } = useSessionListCards(sessionList);

    return (
        <View style={{ flexDirection: 'column', gap: 12 }}>
            <SessionStatusBlock isOnAir={isOnAir} isParticipatible={isParticipatible} />
            {
                sessionList?.length == 0 ?
                    <View style={{ alignSelf: 'center', height: 200, borderWidth: 1, borderColor: Color['grey200'], borderRadius: 10, marginHorizontal: 6, width: width - 48, gap: 8, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', marginHorizontal: 64, color: Color['grey700'], textAlign: 'center', fontSize: 16 }}>
                            {`오늘 예정된 예약이 없어요`}
                        </Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Light', color: Color['grey500'], textAlign: 'center' }}>
                            {`지금 연습실에 가면 바로 이용이 가능해요!`}</Text>
                        <View style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                            <Pressable style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 12, marginHorizontal: 60, borderWidth: 1, borderColor: Color['grey200'], borderRadius: 25, }}
                                onPress={() => navigation.jumpTo('QRScan')}>
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
                        keyExtractor={(item, index) => ((item?.type == 'session' && item.session.sessionType == 'RESERVED' && item.session.title || 'false') + index)}
                        snapToAlignment="start"
                        snapToInterval={width - 36}
                        decelerationRate="fast"
                        onScrollToIndexFailed={(info) => {
                            //로딩이 다 안됐는데 스크롤 입력이 들어올 경우 타임 아웃으로 로딩 시간 확보
                            setTimeout(() => {
                                cardViewRef.current?.scrollToIndex({
                                    index: info.index,
                                    animated: false,
                                });
                            }, 100);
                        }}
                        renderItem={
                            ({ item }: { item: ReservationCard }) => {
                                if (isBlank(item)) {
                                    if (isOnAir) return null
                                    return (
                                        <BlankCardComponent nextReservationTime={item.nextReservationTime} />
                                    )
                                }
                                return (
                                    <SessionCardComponent session={item.session} />

                                )
                            }}
                        ListHeaderComponent={() => {
                            return (<View style={{ width: 24 }} />)
                        }}
                        ItemSeparatorComponent={() => {
                            return (<View style={{ width: 12 }} />)
                        }}
                        ListFooterComponent={() => {
                            return (<View style={{ width: 24 }} />)
                        }}
                    />}
        </View>
    )
}

const ReservationMainBottomLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {


    const navigation = useNavigation<ResevationMainScreenNav>()

    return (
        <Pressable
            style={({ pressed }) => ({
                position: 'absolute',
                bottom: 92,
                height: 'auto',
                width: '100%',
                opacity: pressed ? 0.9 : 1,  // pressed 상태에 따라 opacity 변경
            })} onPress={() => navigation.push('Reservation')}>

            <View style={{ width: '100%', bottom: 0, paddingHorizontal: 24, height: 120, overflow: 'visible', flexDirection: 'column', justifyContent: 'flex-end' }} >
                {children}
            </View>
        </Pressable>
    )
}

const ReservationMainScreen: React.FC = () => {

    const sessionList = useSessionListSocket();

    return (
        <View style={{ backgroundColor: '#FFF', flex: 1, flexDirection: 'column', paddingTop: height / 4 }}>
            <SessionListCards sessionList={sessionList} />
            <ReservationMainBottomLabel>

                <Image source={require('@hongpung/assets/icons/ReservationIcon.png')} style={{ position: 'absolute', width: 120, height: 120, right: 24 + 8 + 4, bottom: -4, zIndex: 1 }}></Image>
                <View style={{ bottom: 0, marginHorizontal: 8, borderWidth: 1, borderColor: Color['grey200'], borderRadius: 10, height: 88, backgroundColor: '#FFF', overflow: 'visible' }}
                >
                    <Text style={{ position: 'absolute', left: 8, bottom: 8, fontSize: 16, fontFamily: 'NanumSquareNeo-Heavy', color: Color['grey700'] }}>연습실 예약</Text>
                </View>
            </ReservationMainBottomLabel>
        </View>
    )
}

export default ReservationMainScreen