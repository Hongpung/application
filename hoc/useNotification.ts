import { registerForPushNotificationsAsync } from "@hongpung/utils/NotificationToken";
import { getToken } from "@hongpung/src/common/lib/TokenHandler";
import * as Notifications from 'expo-notifications';

export const useNotificationSetting = () => {
    const turnOnNotification = async () => {

        try {
            const token = await getToken('token');
            const { status } = await Notifications.requestPermissionsAsync();

            const pushEnable = status === 'granted';
            const sendFormat: { pushEnable: boolean, notificationToken: null | string } = { pushEnable, notificationToken: null }

            if (pushEnable) {
                const Ntoken = await registerForPushNotificationsAsync()
                sendFormat.notificationToken = Ntoken;
            }

            const fetchFCM = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/member/NToken`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': `application/json`,
                    },
                    body: JSON.stringify(sendFormat)
                }
            )

            if (!fetchFCM.ok) throw Error('토큰 생성 실패')

            console.log('알림 정보 전달 완료')
        }
        catch (e) {
            throw Error('failed to create Expo Token')
        }
    }

    const turnOffNotification = async () => {
        try {
            const token = await getToken('token');

            const fetchFCM = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/member/NToken`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': `application/json`,
                    }
                }
            )
            if (!fetchFCM.ok) throw Error('failed to delete Expo Token')
        }
        catch (e) {
            throw Error('failed to delete Expo Token')
        }
    };

    return { turnOffNotification, turnOnNotification }
}