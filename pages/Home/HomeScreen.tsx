import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Animated, AppStateStatus, AppState } from 'react-native';
import { Color } from '@hongpung/ColorSet'

import { debounce } from 'lodash';
import { useAuth } from '@hongpung/hoc/useAuth';
import { Icons } from '@hongpung/src/common/components/icons/Icon';
import * as Notifications from 'expo-notifications'

import { useRecoilState, useRecoilValue } from 'recoil';
import { useOnReserve, loginUserState } from '@hongpung/recoil/authState';
import NoticePartition from '@hongpung/components/home/Notice';
import Banner from '@hongpung/src/features/banner/ui/banner';
import TodaySchedule from '@hongpung/components/home/TodaySchedule';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';
import { StackActions, useIsFocused, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { io } from 'socket.io-client';

import LongButton from '@hongpung/src/common/components/buttons/long-button';
import { onUseSession } from '@hongpung/recoil/sessionState';
import { getToken } from '@hongpung/src/common/lib/TokenHandler';

import { ClubBanner } from '@hongpung/components/home/ClubBanner';


type HomeNavProps = NativeStackNavigationProp<MainStackParamList, 'Home'>

const HomeScreen: React.FC = () => {

    const isFocusing = useIsFocused()
    const navigation = useNavigation<HomeNavProps>()

    const { initAppFetchUser } = useAuth();
    const loginUser = useRecoilValue(loginUserState);
    const isSession = useRecoilValue(useOnReserve);

    const [isUsed, setUsed] = useState(true);
    const [isSlideUp, setSlide] = useState(false);
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

    useEffect(() => {

        const subcription = Notifications.addNotificationReceivedListener(notification => {
            Toast.show({
                type: 'notification',
                text1: notification.request.content.title || 'fail',
                text2: notification.request.content.body || 'fail',
                onPress: () => {
                    if (notification.request.content.data.reservationId) {
                        const { reservationId } = notification.request.content.data;
                        navigation.push('Reservation', { screen: 'ReservationDetail', params: { reservationId } })
                        Toast.hide();
                    }
                    if (notification.request.content.data.noticeId) {
                        const { noticeId } = notification.request.content.data;
                        navigation.push('NoticeStack', { screen: 'NoticeDetail', params: { noticeId } })
                        Toast.hide();
                    }
                },
                position: 'top',
                topOffset: 56,
                visibilityTime: 2000
            });
        });

        return () => {
            subcription.remove();
        };

    }, [])

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={styles.container}
                bounces={false}
                // alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
            >

                {/* 상단 아이콘 부분*/}


                {/* <View style={styles.iconsRow}>
                    <View style={styles.iconContainer}>
                    </View>
                </View> */}
                {/* 상단 일정*/}

                <View style={{ marginHorizontal: 24 }}>
                    <TodaySchedule />
                </View>

                {/* 배너 부분*/}
                <View style={{ marginHorizontal: 24, marginTop: 32 }}>
                    <Banner />
                </View>

                {/* 우리 동아리 */}
                <View style={{ marginHorizontal: 24, marginTop: 32 }}>
                    <ClubBanner />
                </View>

                <View style={{ marginHorizontal: 24, marginTop: 32, marginBottom: 32 }}>
                    <NoticePartition />
                </View>

                {/* 푸터 */}
                <View style={[styles.footer, { flexDirection: 'column', gap: 28, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingVertical: 24 }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 48 }}>
                        <Pressable style={{ flex: 1 }} onPress={() => navigation.push("WebView", { url: 'https://storage.hongpung.com/terms/%EC%84%9C%EB%B9%84%EC%8A%A4+%EC%9D%B4%EC%9A%A9%EC%95%BD%EA%B4%80.html', title: '서비스 이용약관' })}>
                            <Text style={{ textAlign: 'center', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>
                                이용 약관
                            </Text>
                        </Pressable>
                        <Pressable style={{ flex: 1 }} onPress={() => navigation.push("WebView", { url: 'https://storage.hongpung.com/terms/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4+%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8.html', title: '개인정보 처리 방침' })}>
                            <Text style={{ textAlign: 'center', fontFamily: 'NanumSquareNeo-Regular', fontSize: 14, color: Color['grey400'] }}>
                                개인정보 처리 방침
                            </Text>
                        </Pressable>
                    </View>
                    <View style={{ gap: 6 }}>
                        <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 12, color: Color['grey400'] }}>기타 문의</Text>
                        <View style={{ gap: 4 }}>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 12, color: Color['grey400'] }}>대표자: 강윤호 (산틀 18)</Text>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 12, color: Color['grey400'] }}>전화번호: 010-5034-2854</Text>
                            <Text style={{ fontFamily: 'NanumSquareNeo-Regular', fontSize: 12, color: Color['grey400'] }}>이메일: ajtwoddl1236@naver.com</Text>
                        </View>
                    </View>
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
        backgroundColor: 'white',
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
        flexDirection: 'column',
        gap: 8,
        alignItems: 'flex-start',
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
    footer: { paddingHorizontal: 24, marginTop: 12, paddingBottom: 96, backgroundColor: Color['grey200'] }
});

export default HomeScreen;


const BottomOnUser: React.FC<{ toggleBottomSheet: () => void, isSlideUp: boolean, isFocusing: boolean }> = ({ toggleBottomSheet, isSlideUp, isFocusing }) => {

    const [_, setUseRoom] = useRecoilState(useOnReserve);
    const [useSession, setUseSession] = useRecoilState(onUseSession);
    const [onEndModal, OnEnd] = useState(false);

    const socketRef = useRef<any>(null); // 소켓 참조를 저장할 useRef

    const [remainingHour, setRemainingHour] = useState('');
    const [remainingMinnute, setRemainingMinnute] = useState('');

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
            const socket = io(`${process.env.EXPO_PUBLIC_BASE_URL}/roomsession`, {
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