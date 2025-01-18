import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { Color } from '../../../ColorSet';
import Animated, { interpolate, SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable'

import { getToken } from '@hongpung/utils/TokenHandler';
import { StackActions, useNavigation } from '@react-navigation/native';
import useFetchUsingToken from '@hongpung/hoc/useFetchUsingToken';


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
        return `${differenceInSeconds}초`;
    }

    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    if (differenceInMinutes < 60) {
        return `${differenceInMinutes}분`;
    }

    const differenceInHours = Math.floor(differenceInMinutes / 60);
    if (differenceInHours < 24) {
        return `${differenceInHours}시간`;
    }

    const differenceInDays = Math.floor(differenceInHours / 24);
    if (differenceInDays < 7) {
        return `${differenceInDays}일`;
    }
    const differenceInWeeks = Math.floor(differenceInDays / 7);
    return `${differenceInWeeks}주`;
};

const NotificationCard: React.FC<NotificationCard> = ({ notification, onDelete }) => {


    const dragX = useSharedValue<number>(0);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: dragX.value < -20 ? 0.2 : 1,
    }));

    const renderRightActions = (progress: SharedValue<number>, dragXParam: SharedValue<number>, swipeable: SwipeableMethods) => {
        const rightActionAnimatedStyle = useAnimatedStyle(() => {
            const opacity = interpolate(dragXParam.value, [-100, -50, 0], [1, 0.5, 0], 'clamp');
            return {
                opacity
            };
        });

        dragX.set(dragXParam.get())

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
            friction={2} // 스와이프 감도 조절
            overshootRight={false}
        >
            <Animated.View style={[styles.NotificationCard, animatedStyle]}>
                <Animated.View style={{ margin: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Animated.View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* <View><Text style={{ fontSize: 16 }}>{getIcon(notification.data)}</Text></View> */}
                        <Text style={{ fontSize: 16, fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'] }}>{notification.data.title}</Text>
                    </Animated.View>
                    <Text style={{ fontSize: 12, height: 14, fontFamily: "NanumSquareNeo-Regular", color: Color['grey300'] }} >
                        {calculateTimeDifference(new Date(notification.timestamp))} 전
                    </Text>
                </Animated.View>
                <View style={{ marginHorizontal: 24, justifyContent: 'center', height: 60 }}>
                    <Text style={{ textAlignVertical: 'center', color: Color['grey600'], fontFamily: "NanumSquareNeo-Regular", fontSize: 14 }}>
                        {notification.data.body}
                    </Text>
                </View>
            </Animated.View>
        </Swipeable>
    )
}


type NotificationListProps = {
    notifications: NotificationDTO[],
    onDelete: (any: any) => void
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onDelete }) => {

    let showOldNotificationHeader = false;
    return (
        <View style={styles.container}>
            {notifications.map((notification) => {

                const isOldNotification = new Date(notification.timestamp).getTime() < new Date('2024-07-05').getTime();
                const shouldShowHeader = isOldNotification && !showOldNotificationHeader;

                if (shouldShowHeader) {
                    showOldNotificationHeader = true;
                }
                return (
                    <View key={notification.notificationId}>
                        {shouldShowHeader && (
                            <View style={{ backgroundColor: 'transparent', marginVertical: 4, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ height: 0, borderWidth: 0.6, flex: 1, marginRight: 8, borderColor: Color['grey200'] }} />
                                <Text style={{ color: Color['grey300'] }}>이전 알림</Text>
                                <View style={{ height: 0, borderWidth: 0.6, flex: 1, marginLeft: 8, borderColor: Color['grey200'] }} />
                            </View>
                        )}
                        <GestureHandlerRootView>
                            <NotificationCard
                                notification={notification}
                                onDelete={() => { onDelete(notification.notificationId) }}
                            />
                        </GestureHandlerRootView>
                    </View>
                );
            })}
        </View>
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
    const handleDelete = (id: number) => {
        const deleteFetch = async () => {
            try {
                const token = await getToken('token');
                if (!token) { throw Error('invalid Token'); }

                const response = await fetch(`${process.env.BASE_URL}/notification/delete/${id}`, {
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

    const { data: notifications, loading, error } = useFetchUsingToken<NotificationDTO[]>(`${process.env.SUB_API}/notification/my`);

    useFetchUsingToken<NotificationDTO[]>(`${process.env.SUB_API}/notification/read`, { method: 'PATCH' })

    useEffect(() => {
        console.log('notifications:'+notifications)
        if (notifications)
            setNotifications(notifications)
    }, [notifications])

    if (!notifications || loading)
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }} />
        )
    return (
        <ScrollView style={styles.container} >
            <View style={{ marginTop: 6 }} />
            <NotificationList notifications={Notifications} onDelete={handleDelete} />
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