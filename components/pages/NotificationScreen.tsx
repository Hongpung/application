import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Color } from '../../ColorSet'

import { Directions, GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from './pageTypes';


enum NotificationType {
    Notification = '공지사항',
    Performance = '공연',
    Invited = '초대',
    Assignment = '예약 알림'
    // 다른 알림 타입들을 여기에 추가할 수 있습니다.
}

type Notification = {
    id: any,
    type: NotificationType,
    message: string
    time: Date;
};

type NotificationCard = {
    notification: Notification,
    onDelete: () => void;
    onClose: () => void;
    isOpen: boolean;
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

const NotificationCard: React.FC<NotificationCard> = ({ notification, onDelete, onClose, isOpen }) => {

    const swipeableRef = useRef<Swipeable>(null);
    const [isSwipeableOpen, setSwipeableOpen] = useState(false);

    const renderRightActions = () => (
        <Pressable style={{
            backgroundColor: Color[`red500`],
            justifyContent: 'center',
            alignItems: 'center',
            width: 140,
            marginVertical: 6,
            marginLeft:-30
        }}
            onPress={() => {
                onDelete();
                if (swipeableRef.current) {
                    swipeableRef.current.close();
                }
            }}
        >
            <Text style={{
                color: Color[`red100`],
                fontSize: 16,
                fontFamily: "NanumSquareNeo-Bold",
            }}>삭제</Text>
        </Pressable>
    );


    return (
        <Swipeable
            renderRightActions={renderRightActions}
            onSwipeableOpen={() => {
                setSwipeableOpen(true);
                onClose();
            }}
            onSwipeableClose={() => setSwipeableOpen(false)}>
            <View style={[styles.NotificationCard]}>
                <View style={{ margin: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View><Text style={{ fontSize: 16 }}>{getIcon(notification.type)}</Text></View>
                        <Text style={{ fontSize: 16, fontFamily: "NanumSquareNeo-Regular", color: Color['grey400'] }}>{notification.type}</Text>
                    </View>
                    <Text style={{ fontSize: 12, height: 14, fontFamily: "NanumSquareNeo-Regular", color: Color['grey300'] }} >
                        {calculateTimeDifference(notification.time)} 전
                    </Text>
                </View>
                <View style={{ marginHorizontal: 24, justifyContent: 'center', height: 60 }}>
                    <Text style={{ textAlignVertical: 'center', color: Color['grey600'], fontFamily: "NanumSquareNeo-Regular", fontSize: 14 }}>
                        {notification.message}
                    </Text>
                </View>
            </View>
        </Swipeable>
    )
}


type NotificationList = {
    notifications: Notification[],
    onDelete: (any: any) => void
}

const NotificationList: React.FC<NotificationList> = ({ notifications, onDelete }) => {

    const [openNotificationId, setOpenNotificationId] = useState<number | null>(null);

    return (
        <GestureHandlerRootView style={styles.container}>
            {notifications.map((notification: Notification, id: any) => (
                <NotificationCard
                    key={id}
                    notification={notification}
                    onDelete={() => { onDelete(notification.id) }}
                    onClose={() => setOpenNotificationId(notification.id)}
                    isOpen={openNotificationId !== null && openNotificationId !== notification.id} />
            ))}
        </GestureHandlerRootView>
    )
}

type NotificationProps = NativeStackScreenProps<HomeStackParamList,'Notification'>;

const NotificationScreen: React.FC<NotificationProps> = ({navigation}) => {
    const [Notifications, setNotifications] = useState<Notification[]>([]);
    const handleDelete = (id: any) => {
        setNotifications(Notifications.filter(notification => notification.id !== id));
    };


    const notifications: Notification[] = [
        {
            id: 1,
            type: NotificationType.Assignment,
            time: new Date('2024-02-05'),
            message: '내일(7.6(월)) 16:00~17:00에 예약한 일정이 있어요. 참고해주세요.',
        },
        {
            id: 2,
            type: NotificationType.Notification,
            time: new Date('2024-02-05'),
            message: '안전검사로 인한 연습실 사용 일시중단 안내',
        },
        {
            id: 3,
            type: NotificationType.Notification,
            time: new Date('2024-02-05'),
            message: '안전검사로 인한 연습실 사용 일시중단 안내',
        },
        {
            id: 4,
            type: NotificationType.Notification,
            time: new Date('2024-02-05'),
            message: '안전검사로 인한 연습실 사용 일시중단 안내',
        },
    ];

    useEffect(() => {
        setNotifications(notifications);
    }, [])
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