import { AppState, Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';


Notifications.setNotificationHandler({
  handleNotification: async () => {
    const appState = AppState.currentState;
    const receive = await AsyncStorage.getItem('receive-push')
    return {
      shouldShowBanner: appState !== 'active' && receive == 'true',
      shouldShowAlert: appState !== 'active' && receive == 'true',
      shouldShowList: appState !== 'active' && receive == 'true',
      shouldPlaySound: true,
      shouldSetBadge: false,
    }
  },
});

export async function registerForPushNotificationsAsync() {
    let token = null;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return null;
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        // EAS projectId is used here.
        try {
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                throw new Error('Project ID not found');
            }
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(token);
        } catch (e) {
            token = null;
        }
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}