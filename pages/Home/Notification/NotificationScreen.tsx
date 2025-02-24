import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { Color } from '../../../ColorSet';
import Animated, { interpolate, SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable'

import { getToken } from '@hongpung/src/common/lib/TokenHandler';
import { StackActions, useNavigation } from '@react-navigation/native';
import useFetchUsingToken from '@hongpung/src/common/hooks/useFetchUsingToken';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';

type HomeNavProps = NativeStackNavigationProp<MainStackParamList, 'Home'>

enum NotificationType {
    Notification = '공지사항',
    Performance = '공연',
    Invited = '초대',
    Assignment = '예약 알림'
    // 다른 알림 타입들을 여기에 추가할 수 있습니다.
}

// type Notification = {
//     id: any,
//     title: string;
//     type: NotificationType,
//     message: string
//     time: Date;
// };

type NotificationCard = {
    notification: NotificationDTO,
    onDelete: () => void;
}

const getIcon = (type: NotificationType) => {
    switch (type) {
        case NotificationType.Notification:
            return '🔔'; // 공지사항 아이콘
        case NotificationType.Performance:
            return '🎭'; // 공연 아이콘
        case NotificationType.Invited:
            return '📨'; // 초대 아이콘
        case NotificationType.Assignment:
            return '📅'; // 예약 알림 아이콘
        default:
            return 'ℹ️'; // 기본 아이콘
    }
}
const calculateTimeDifference = (date1: Date) => {
    const now = new Date();
    const differenceInMilliseconds = now.getTime() - date1.getTime();
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

    if (differenceInSeconds < 60) {
        return `${differenceInSeconds}초 전`;
    }

    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    if (differenceInMinutes < 60) {
        return `${differenceInMinutes}분 전`;
    }

    const differenceInHours = Math.floor(differenceInMinutes / 60);
    if (differenceInHours < 24) {
        return `${differenceInHours}시간 전`;
    }

    const differenceInDays = Math.floor(differenceInHours / 24);
    if (differenceInDays == 1) {
        return '어제';
    }
    if (differenceInDays < 7) {
        return `${differenceInDays}일 전`;
    }
    const differenceInWeeks = Math.floor(differenceInDays / 7);
    return `${differenceInWeeks}주 전`;
};

const NotificationCard: React.FC<NotificationCard> = ({ notification, onDelete }) => {

    const navigation = useNavigation<HomeNavProps>();

    const [isSwiped, setIsSwiped] = useState(false); // Swipeable 상태 관리

    const renderRightActions = (progress: SharedValue<number>, dragXParam: SharedValue<number>, swipeable: SwipeableMethods) => {
        const rightActionAnimatedStyle = useAnimatedStyle(() => {
            const opacity = interpolate(dragXParam.value, [-100, -50, 0], [1, 0.5, 0], 'clamp');
            return {
                opacity
            };
        });

        return (
            <Pressable
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={() => {
                    onDelete();
                    swipeable.close();
                }}
            >
                <Animated.View style={[{
                    flex: 1,
                    backgroundColor: Color['red500'],
                    marginVertical: 6,
                    alignItems: 'center',
                    justifyContent: "center",
                    marginRight: 28,
                    marginLeft: -20,
                    borderRadius: 5,
                    width: 140
                }, rightActionAnimatedStyle]}>
                    <Text style={{
                        textAlign: 'center',
                        width: 140,
                        color: Color['red100'],
                        fontSize: 16,
                        fontFamily: "NanumSquareNeo-Bold",
                    }}>삭제</Text>
                </Animated.View>
            </Pressable>
        );
    };
    return (

        <Swipeable
            renderRightActions={renderRightActions}
            rightThreshold={40} // 오른쪽 스와이프 임계값
            friction={1.5} // 스와이프 감도 조절
            overshootRight={false}
            onSwipeableWillClose={() => setIsSwiped(false)} 
            onSwipeableOpenStartDrag={() => setIsSwiped(true)}
        >
            <Animated.View style={[styles.NotificationCard]}>
                <Pressable onPress={() => {

                    if (isSwiped) return;
                    
                    else if (notification.data.data?.reservationId) {
                        const { reservationId } = notification.data.data;
                        navigation.goBack();
                        navigation.push('Reservation', { screen: 'ReservationDetail', params: { reservationId } })
                    }
                    else if (notification.data.data?.noticeId) {
                        const { noticeId } = notification.data.data;
                        navigation.goBack();
                        navigation.push('NoticeStack', { screen: 'NoticeDetail', params: { noticeId } })
                    }
                }}>
                    <View style={{ margin: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* <View><Text style={{ fontSize: 16 }}>{getIcon(notification.data)}</Text></View> */}
                            <Text style={{ fontSize: 16, fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'] }}>{notification.data.title}</Text>
                        </View>
                        <Text style={{ fontSize: 12, height: 14, fontFamily: "NanumSquareNeo-Regular", color: Color['grey300'] }} >
                            {calculateTimeDifference(new Date(notification.timestamp))}
                        </Text>
                    </View>
                    <View style={{ marginHorizontal: 24, justifyContent: 'center', height: 60 }}>
                        <Text style={{ textAlignVertical: 'center', color: notification.isRead ? Color['grey300'] : Color['grey600'], fontFamily: "NanumSquareNeo-Regular", fontSize: 14 }}>
                            {notification.data.body}
                        </Text>
                    </View>
                </Pressable>
            </Animated.View>
        </Swipeable>
    )
}

interface NotificationDTO {
    notificationId: number;
    isRead: boolean,
    data: { title: string, body: string, data?: Record<string, any> },
    timestamp: string
}


const NotificationScreen: React.FC = () => {
    const navigation = useNavigation();

    const [Notifications, setNotifications] = useState<NotificationDTO[]>([]);
    const [lastReadNotificationId, setLastNotificationId] = useState<number | null>(null)
    const handleDelete = (id: number) => {
        const deleteFetch = async () => {
            try {
                const token = await getToken('token');
                if (!token) { throw Error('invalid Token'); }

                const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/notification/delete/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}`, }
                })

                if (!response.ok) throw Error('Delete Fail')

                setNotifications(Notifications.filter(notification => notification.notificationId !== id));
            } catch (err: unknown) {
                if (err instanceof Error) {
                    // `invalid Token` 메시지일 경우 처리
                    if (err.message === 'invalid Token') {

                        navigation.dispatch(StackActions.replace('Login'))
                        return;
                    }
                    // `AbortError`일 경우 처리
                    if (err.name === 'AbortError') {
                        const status = (err as any).status ?? ''; // status가 있으면 사용, 없으면 빈 문자열

                    }
                } else {
                    console.error('An unknown error occurred');
                }
            }
        }
        deleteFetch()

    };


    const handleDeleteAll = () => {
        const deleteAll = async () => {
            try {
                const token = await getToken('token');
                if (!token) { throw Error('invalid Token'); }

                const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/notification/delete/all`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}`, }
                })

                if (!response.ok) throw Error('Delete Fail')

                setNotifications([]);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    // `invalid Token` 메시지일 경우 처리
                    if (err.message === 'invalid Token') {

                        navigation.dispatch(StackActions.replace('Login'))
                        return;
                    }
                    // `AbortError`일 경우 처리
                    if (err.name === 'AbortError') {
                        const status = (err as any).status ?? ''; // status가 있으면 사용, 없으면 빈 문자열

                    }
                } else {
                    console.error('An unknown error occurred');
                }
            }
        }
        deleteAll()
        console.log('deleteAll')

    };

    const { data: notificationData, loading, error } = useFetchUsingToken<NotificationDTO[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/notification/my`);


    useEffect(() => {
        console.log('notifications:' + notificationData)
        if (notificationData) {
            setNotifications(notificationData)
            const lastReadNotification = notificationData.find(notification => notification.isRead)
            setLastNotificationId(lastReadNotification?.notificationId || null);
        }
    }, [notificationData])

    useEffect(() => {
        return () => {
            const readAll = async () => {
                try {
                    const token = await getToken('token');

                    const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/notification/read`,
                        {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                            },
                        }
                    )
                    if (!response.ok) {
                        console.log(response.status + response.statusText)
                        throw new Error('Network response was not ok');
                    }
                } catch {
                    Alert.alert('네트워크 오류가 발생하였습니다.')
                }
            }

            readAll()
        }
    }, [])

    if (!notificationData || loading)
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }} />
        )
    return (
        <ScrollView style={styles.container} >
            <View style={{ marginTop: 6 }} />
            <View style={styles.container}>
                {
                    Notifications.length > 0 ?
                        <>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 28, marginVertical: 8 }}>
                                <Pressable onPress={() => {
                                    Alert.alert('확인', '알림을 모두 삭제할까요?', [{ text: '닫기' }, { text: '삭제', onPress: handleDeleteAll }])

                                }}>
                                    <Text style={{ fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'], fontSize: 16 }}>전체 삭제</Text>
                                </Pressable>
                            </View>
                            {Notifications.map((notification) => {
                                return (
                                    <>
                                        {
                                            lastReadNotificationId == notification.notificationId &&
                                            <View key={'latest-line'} style={{ backgroundColor: 'transparent', marginVertical: 4, marginHorizontal: 36, flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{ height: 0, borderWidth: 0.6, flex: 1, marginRight: 8, borderColor: Color['grey200'] }} />
                                                <Text style={{ fontFamily: "NanumSquareNeo-Regular", color: Color['grey300'] }}>이전 알림</Text>
                                                <View style={{ height: 0, borderWidth: 0.6, flex: 1, marginLeft: 8, borderColor: Color['grey200'] }} />
                                            </View>
                                        }
                                        <View key={notification.notificationId}>
                                            <GestureHandlerRootView>
                                                <NotificationCard
                                                    notification={notification}
                                                    onDelete={() => { handleDelete(notification.notificationId) }}
                                                />
                                            </GestureHandlerRootView>
                                        </View>
                                    </>
                                );

                            })}
                        </>
                        :
                        <View style={{ flex: 1, height: 500, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'], fontSize: 16 }}>
                                새로운 알림이 없습니다.
                            </Text>
                        </View>
                }
            </View>
        </ScrollView>
    )
}



export default NotificationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'white',
        overflow: 'scroll',
    },
    NotificationCard: { marginHorizontal: 28, marginVertical: 6, flex: 1, height: 120, borderRadius: 5, borderWidth: 1, borderColor: Color['grey100'], backgroundColor: "#FFF" }
})