import { StyleSheet, Text, View, Alert, Linking, AppState, Modal, ActivityIndicator } from 'react-native'
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react'
import { Color } from '@hongpung/ColorSet';
import CustomSwitch from '@hongpung/src/common/components/switch/switch';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotificationSetting } from '@hongpung/hoc/useNotification';

const NotificationSettingScreen: React.FC = () => {


    const { turnOffNotification, turnOnNotification } = useNotificationSetting();
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setLoading] = useState(true)

    const [appState, setAppState] = useState(AppState.currentState);

    const handleAppStateChange = (nextAppState: AppState["currentState"]) => {
        if (appState.match(/inactive|background/) && nextAppState === "active") {
            const checkNotificationPermission = async () => {
                const { status } = await Notifications.getPermissionsAsync();
                setIsEnabled(status === 'granted');
            };
            checkNotificationPermission();
        }
        setAppState(nextAppState);
    };

    useEffect(() => {
        const subscription = AppState.addEventListener("change", handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [appState]);

    useEffect(() => {

        const loadSettion = async () => {
            const pushOption = await AsyncStorage.getItem('receive-push');
            if (pushOption === 'true') setIsEnabled(true)
            setLoading(false)
        }

        loadSettion();

        return () => {
            if (isEnabled)
                turnOnNotification();
            else
                turnOffNotification()

        }
    }, [])

    const toggleNotification = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (isEnabled) { // false로 변환
            await AsyncStorage.setItem('receive-push', 'false');
            console.log(status)
            if (status === 'granted') {
                setIsEnabled(false);
            } else {
                Alert.alert(
                    '알림 권한 거부',
                    '알림 권한이 거부되었습니다. 시스템 설정에서 권한을 부여해야 알림을 받을 수 있습니다.',
                    [{ text: '확인', onPress: () => { Linking.openSettings(); } }]
                );
            }
        } else { // true로 변환
            console.log(status)
            if (status === 'granted') {
                await AsyncStorage.setItem('receive-push', 'true');
                setIsEnabled(true);
            } else {
                Alert.alert(
                    '알림 권한 거부',
                    '알림 권한이 거부되었습니다. 시스템 설정에서 권한을 부여해야 알림을 받을 수 있습니다.',
                    [{ text: '확인', onPress: () => { Linking.openSettings(); } }]
                );
            }
        }
    };

    return (
        <GestureHandlerRootView>
            <View>
                <Modal visible={isLoading} transparent>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator color={'white'} size={'large'} />
                    </View>
                </Modal>
                <View style={{ height: 24 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 36, justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700'], fontSize: 16 }}>푸시 알림</Text>
                    <CustomSwitch
                        onChange={toggleNotification}
                        value={isEnabled}
                    />
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

export default NotificationSettingScreen
