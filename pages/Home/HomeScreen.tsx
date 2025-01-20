import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, Modal, FlatList, Animated, NativeSyntheticEvent, AppStateStatus, AppState } from 'react-native';
import { Color } from '@hongpung/ColorSet'

import { debounce } from 'lodash';
import { useAuth } from '@hongpung/hoc/useAuth';
import { Icons } from '@hongpung/components/common/Icon';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useOnReserve, loginUserState } from '@hongpung/recoil/authState';
import NoticePartition from '@hongpung/components/home/Notice';
import Banner from '@hongpung/components/home/Banner';
import TodaySchedule from '@hongpung/components/home/TodaySchedule';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';
import { StackActions, useIsFocused, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { io } from 'socket.io-client';
import { RealtimeSession, ReservationSession } from '../Reserve/SessionTypes';
import LongButton from '@hongpung/components/buttons/LongButton';
import { onUseSession } from '@hongpung/recoil/sessionState';
import { getToken } from '@hongpung/utils/TokenHandler';
import useFetchUsingToken from '@hongpung/hoc/useFetchUsingToken';
import { NotificationIcon } from '@hongpung/components/home/NotificationIcon';
import { ProfileIcon } from '@hongpung/components/home/ProfileIcon';


type HomeNavProps = NativeStackNavigationProp<MainStackParamList, 'Home'>

const HomeScreen: React.FC = () => {

    const isFocusing = useIsFocused()

    const navigation = useNavigation<HomeNavProps>()
    const { initAppFetchUser } = useAuth();
    const loginUser = useRecoilValue(loginUserState);
    const isSession = useRecoilValue(useOnReserve);

    const [isUsed, setUsed] = useState(true);
    const [isSlideUp, setSlide] = useState(false);
    const today = new Date();
    const animatedValue = useRef(new Animated.Value(-82)).current; // 초기 bottom 값

    const toggleBottomSheet = useCallback(() => {
        if (isSlideUp) {
            // 바텀 시트 닫기
            Animated.timing(animatedValue, {
                toValue: -82, // 닫을 때 bottom 위치 (화면 아래로 숨기기)
                duration: 200,
                useNativeDriver: false,
            }).start(() => setSlide(false));
        } else {
            setSlide(true);
            // 바텀 시트 열기
            Animated.timing(animatedValue, {
                toValue: 0, // 열릴 때 bottom 위치
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    }, [isSlideUp, isSession]);

    useEffect(() => {

        const loadUserinfo = async () => {
            await initAppFetchUser();
        }

        setUsed(false)
        if (!loginUser) {
            loadUserinfo();
        }
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
            >

                {/* 상단 아이콘 부분*/}


                <View style={styles.iconsRow}>
                    <View style={styles.iconContainer}>
                        <NotificationIcon />
                        <ProfileIcon />
                    </View>
                </View>

                {/* 상단 문구*/}
                <View style={styles.textRow}>
                    <Text style={styles.dateText}>{today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일</Text>
                    <Text style={styles.greetingText}>{loginUser?.name}님 안녕하세요</Text>
                </View>

                {/* 상단 일정*/}

                <View style={{ marginHorizontal: 24, marginTop: 12 }}>
                    <TodaySchedule />
                </View>

                {/* 배너 부분*/}
                <View style={{ marginHorizontal: 24, marginTop: 20 }}>
                    <Banner />
                </View>

                {/* 우리 동아리 */}
                <View style={{ marginHorizontal: 24, marginTop: 32, }}>
                    <TouchableOpacity activeOpacity={0.85}
                        onPress={() => navigation.navigate('MyClub', { screen: 'MyClubHome' })}>
                        <View style={{
                            height: 120,
                            backgroundColor: Color['grey300'],
                            borderRadius: 10,
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                            paddingRight: 16,
                            paddingBottom: 12
                        }} >
                            <Text style={{
                                fontSize: 18,
                                fontFamily: 'NanumSquareNeo-Bold',
                            }}>
                                우리 동아리
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ marginHorizontal: 24, marginTop: 24 }}>
                    <NoticePartition />
                </View>

                {/* 일정 홍보 */}

                {/* <View style={{ marginTop: 32 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 20, alignItems: 'flex-end', marginHorizontal: 28, marginBottom: 16 }}>
                        <Text style={{
                            fontSize: 18,
                            fontFamily: 'NanumSquareNeo-Bold',
                            height: 20
                        }}>
                            인원을 모으는 중인 활동
                        </Text>

                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'NanumSquareNeo-Light',
                                height: 16
                            }}>
                                더 알아보기
                            </Text>
                            <Icons name='chevron-forward-outline' color={Color['grey400']} size={18}></Icons>
                        </Pressable>
                    </View>

                    <ScrollView style={{ height: 126, }} horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ marginLeft: 18 }} />
                            {
                                Array(18).fill(null).map((_, index) => (
                                    <View
                                        key={index}
                                        style={{ height: 126, width: 136, borderColor: Color['grey100'], borderRadius: 10, marginHorizontal: 6, borderWidth: 1 }}
                                    >
                                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: Color['grey700'], fontSize: 14, marginHorizontal: 8, marginTop: 12 }} numberOfLines={2} ellipsizeMode='tail'>인인 활동입니다</Text>
                                        <View style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4, bottom: 32, position: 'absolute' }}>
                                            <View style={{ width: 24, height: 24 }}>
                                                <Icons name='people' color={Color['grey200']} size={24}></Icons>
                                            </View>
                                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], fontSize: 14 }}>{`24`}</Text>
                                        </View>
                                        <View style={{ marginHorizontal: 6, flexDirection: 'row', bottom: 12, position: 'absolute' }}>
                                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], fontSize: 12 }}>{`#술모임`}</Text>
                                            <View style={{ width: 4 }} />
                                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'], fontSize: 12 }}>{`#술모임`}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                            <View
                                key={'last'}
                                style={{ height: 126, width: 82, borderRadius: 10, marginHorizontal: 6, justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'], fontSize: 16, marginBottom: 8 }}>더보기</Text>
                                <Icons name='arrow-forward-circle' color={Color['grey300']}></Icons>
                            </View>
                        </View>
                        <View style={{ marginRight: 18 }} />
                    </ScrollView>
                </View> */}



                {/* 공연 홍보 */}

                {/* <View style={{ marginTop: 32 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 20, alignItems: 'flex-end', marginHorizontal: 28, marginBottom: 16 }}>
                        <Text style={{
                            fontSize: 18,
                            fontFamily: 'NanumSquareNeo-Bold',
                            height: 20
                        }}>
                            공연 홍보
                        </Text>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'NanumSquareNeo-Light',
                                height: 16
                            }}>
                                더 알아보기
                            </Text>
                            <Icons name='chevron-forward-outline' color={Color['grey400']} size={18}></Icons>
                        </Pressable>
                    </View>

                    <ScrollView style={{ height: 208, }} horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <View style={{ marginLeft: 18 }} />
                            {
                                Array(6).fill(null).map((_, index) => (
                                    <View
                                        key={index}
                                        style={{ height: 208, width: 136, borderColor: Color['grey100'], borderRadius: 10, marginHorizontal: 6, overflow: 'hidden', borderWidth: 1 }}
                                    >
                                        <View style={{ height: 148, backgroundColor: Color['blue100'] }} />
                                        <Text style={{ marginHorizontal: 8, marginTop: 8, fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'], fontSize: 14 }}>산틀-산데렐라</Text>
                                        <View style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4, bottom: 4, position: 'absolute' }}>
                                            <View style={{ width: 20, height: 20 }} >
                                                <Icons name='people' color={Color['red200']} size={20}></Icons>
                                            </View>
                                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', color: Color['red400'], fontSize: 12 }}>{`24`}</Text>
                                        </View>
                                    </View>
                                ))
                            }

                            <View
                                key={'last'}
                                style={{ height: 208, width: 82, borderRadius: 10, marginHorizontal: 6, justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey400'], fontSize: 16, marginBottom: 8 }}>더보기</Text>
                                <Icons name='arrow-forward-circle' color={Color['grey300']}></Icons>
                            </View>
                            <View style={{ marginRight: 18 }} />
                        </View>
                    </ScrollView>
                </View> */}





                {/* 푸터 */}
                <View style={[styles.footer, { flexDirection: 'row', justifyContent: 'center', borderTopLeftRadius: 28, borderTopRightRadius: 28 }]}>
                    <Text style={{ height: 20, textAlign: 'center', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'], marginTop: 24 }}>
                        개인정보 처리 방침
                    </Text>
                    {/* <Text style={{ height:20, textAlign: 'center', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, borderBottomWidth: 1, color: Color['grey400'], marginTop: 24 }}>
                        이용 약관
                    </Text> */}
                </View>
                {isUsed && <View style={{ height: 24 }} />}
            </ScrollView>
            {isSession &&
                <Animated.View style={{ position: 'absolute', left: 0, right: 0, bottom: animatedValue, height: 184, flex: 1, }}>
                    <BottomOnUser isFocusing={isFocusing} isSlideUp={isSlideUp} toggleBottomSheet={toggleBottomSheet} />
                </Animated.View>}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        overflow: 'scroll',
    },
    iconsRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        height: 30,
        paddingHorizontal: 24,
        marginTop: 8
    },
    iconContainer: {
        flexDirection: 'row',
        height: 30,
        width: 78,
        gap: 4,
        justifyContent: 'flex-end'
    },
    icons: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
    },
    textRow: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 24,
        marginTop: 24
    },
    greetingText: {
        position: 'relative',
        textAlign: 'right',
        color: Color['grey800'],
        fontSize: 20,
        fontFamily: 'NanumSquareNeo-Bold',
        marginRight: 4
    },
    dateText: {
        position: 'relative',
        color: Color['grey800'],
        fontSize: 14,
        fontFamily: 'NanumSquareNeo-Regular',
        lineHeight: 16,
        marginLeft: 4
    },
    ScheduleOfDate: {
        marginHorizontal: 24,
        height: 160,
        borderRadius: 10,
        marginTop: 12,
        backgroundColor: Color['green500']
    },
    AdvertiseBanner: {
        marginTop: 28,
        marginHorizontal: 24,
        height: 120,
        borderRadius: 10,
        overflow: 'hidden'
    },
    footer: { paddingHorizontal: 24, height: 180, marginTop: 12, paddingBottom: 96, backgroundColor: Color['grey200'] }
});

export default HomeScreen;


const BottomOnUser: React.FC<{ toggleBottomSheet: () => void, isSlideUp: boolean, isFocusing: boolean }> = ({ toggleBottomSheet, isSlideUp, isFocusing }) => {

    const [useRoom, setUseRoom] = useRecoilState(useOnReserve);
    const [useSession, setUseSession] = useRecoilState(onUseSession);
    const [onEndModal, OnEnd] = useState(false);

    const socketRef = useRef<any>(null); // 소켓 참조를 저장할 useRef

    const [remainingHour, setRemainingHour] = useState('');
    const [remainingMinnute, setRemainingMinnute] = useState('');

    const loginUser = useRecoilValue(loginUserState);

    const calculateTimeDifference = () => {
        if (useSession) {
            const now = new Date();

            // 목표 시각 생성
            const [hours, minutes, seconds] = useSession?.endTime.split(':').map(Number);
            const targetDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                hours,
                minutes,
                seconds
            );

            // 시간 차이 계산
            const diff = targetDate.getTime() - now.getTime();
            if (diff <= 0) {
                setRemainingHour('00 시간');
                setRemainingMinnute('00 분');
                return;
            }

            const diffHours = Math.floor(diff / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setRemainingHour(`${String(diffHours).padStart(2, '0')}시간`)
            setRemainingMinnute(`${String(diffMinutes).padStart(2, '0')}분`);
        }
    };


    useEffect(() => {

        const connectSocket = async () => {
            if (socketRef.current) {
                socketRef.current.disconnect(); // 기존 소켓 연결 해제
            }
            const token = await getToken('token')
            console.log(token)
            const socket = io(`${process.env.SUB_API}/roomsession`, {
                transports: ['websocket'],
                auth: { token },
                reconnection: true,
            });

            socket.on('connect', () => {
                console.log('Connected to WebSocket Gateway');
                socket.emit('fetchCurrentSession');
            });

            socket.on('currentSession', (data) => {
                const currentSession = JSON.parse(data)
                setUseSession(currentSession)
            })

            socket.on('fetchSessionUpdate', (data) => {

                console.log('fetchSessionUpdate')
                const changedSession = JSON.parse(data)
                setUseSession(changedSession)
            })

            socket.on('sessionEnded', () => {
                console.log('sessionEnded')
                OnEnd(true)
                setUseSession(null)
            })

            socket.on('forceEnded', () => {
                console.log('sessionForceEnded')
                alert('세션 강제 종료')
                OnEnd(true)
                setUseSession(null)
            })

            socket.on('connect_error', (error) => {
                console.log(error.name)
                Toast.show({
                    type: 'error',
                    text1: error.message,
                    position: 'bottom',
                    bottomOffset: 60,
                    visibilityTime: 3000,
                });
            });


            socket.on('invalid-user', () => {
                alert('권한이 없습니다.')
                navigation.dispatch(StackActions.replace('HomeStack'))
                socket.disconnect()
                setUseRoom(false)
            });

            socket.on('disconnect', (reason) => {
                console.log('Disconnected:', reason);
            });

            socketRef.current = socket; // 소켓 참조 업데이트
        };

        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
                console.log('App is active');
                connectSocket(); // 페이지 활성화 시 소켓 재연결
            } else {
                console.log('App is not active');
                if (socketRef.current) {
                    socketRef.current.disconnect(); // 페이지 비활성화 시 소켓 해제
                }
            }
        };

        connectSocket();

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            // 컴포넌트 언마운트 시 소켓 해제 및 이벤트 리스너 제거
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        // 초기 시간 계산
        calculateTimeDifference();

        // 1초마다 시간 업데이트
        const interval = setInterval(calculateTimeDifference, 1000);

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
    }, [useSession?.endTime]);
    const navigation = useNavigation<HomeNavProps>()

    if (!useSession) return (
        <>
            <Modal visible={onEndModal} transparent>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center' }}>
                    <View style={{ marginHorizontal: 24, paddingVertical: 24, backgroundColor: '#FFF', display: 'flex', gap: 16, borderRadius: 15 }}>
                        <Text style={{
                            paddingHorizontal: 24,
                            fontFamily: 'NanumSquareNeo-Regular',
                            fontSize: 16,
                        }}>세션 종료되었어요</Text>
                        <LongButton color='blue' innerText={'확인'} isAble={true} onPress={() => {
                            setUseRoom(false)
                            OnEnd(false)
                        }} />
                    </View>
                </View>
            </Modal>
        </>

    )
    return (
        <>
            <View style={{ backgroundColor: `rgba(0,0,0,0.8)`, flex: 1, borderRadius: 15, overflow: 'hidden' }}>
                <Pressable style={{ display: 'flex', alignItems: 'center', marginTop: 8, justifyContent: 'center' }}
                    onPress={toggleBottomSheet}>
                    <Icons name={isSlideUp ? 'chevron-down' : 'chevron-up'} color={'#FFF'} size={24} />
                </Pressable>
                <View style={{ flexDirection: 'row', marginHorizontal: 24, justifyContent: 'space-between' }}>
                    <View style={{ justifyContent: 'center', height: 64, alignItems: 'center', gap: 4 }}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14 }}>남은 예약 시간</Text>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey300'], fontSize: 12 }}>({useSession.startTime.slice(0, -3)}~{useSession.endTime.slice(0, -3)})</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 110, gap: 12 }}>
                        {Number(remainingHour) != 0 && <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14 }}>{remainingHour}</Text>}
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14 }}>{remainingMinnute}</Text>
                    </View>
                    <Pressable style={{ justifyContent: 'center' }}
                        onPress={debounce(() => navigation.push('UsingManage'), 1000, { leading: true, trailing: false })}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: '#FFF', fontSize: 14, backgroundColor: `rgba(0,0,0,0.4)`, padding: 16, borderRadius: 8, overflow: 'hidden' }}>{`연장/종료`}</Text>
                    </Pressable>
                </View>
            </View>
        </>

    )
}