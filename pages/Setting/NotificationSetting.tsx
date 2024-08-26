import { StyleSheet, Text, View, Alert, Linking, AppState } from 'react-native'
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react'
import { Color } from '../../ColorSet';
import CustomSwitch from '../../components/CustomSwitch';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const NotificationSettingScreen: React.FC = () => {

    const [isEnabled, setIsEnabled] = useState(false);
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


    const toggleNotification = async () => {
        if (isEnabled) {
            Alert.alert(
                '알림 비활성화',
                '알림을 비활성화하려면 시스템 설정에서 직접 변경해야 합니다.',
                [{ text: '확인', onPress: () => { Linking.openSettings(); } }]
            );
        } else {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
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
                <View style={{ height: 24 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 36, justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700'], fontSize: 16 }}>알림 설정</Text>
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

const styles = StyleSheet.create({})