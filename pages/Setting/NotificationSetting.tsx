import { StyleSheet, Text, View, Switch, Alert, Linking, AppState } from 'react-native'
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react'

const NotificationSettingScreen: React.FC = () => {

    const [isEnabled, setIsEnabled] = useState(false);
    const [appState, setAppState] = useState(AppState.currentState);

    const handleAppStateChange = (nextAppState:AppState["currentState"]) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        console.log("App has come to the foreground!");
  
        const checkNotificationPermission = async () => {
          const { status } = await Notifications.getPermissionsAsync();
          setIsEnabled(status === 'granted');
        };
  
        checkNotificationPermission();
      }
  
      setAppState(nextAppState); // 상태를 업데이트하여 리렌더링 트리거
    };
  
    useEffect(() => {
      const subscription = AppState.addEventListener("change", handleAppStateChange);
  
      return () => {
        subscription.remove(); // Clean up the event listener when the component unmounts
      };
    }, [appState]);
  

    const toggleSwitch = async () => {
        if (isEnabled) {
            // 알림 권한이 이미 활성화된 경우, 스위치를 끄면 사용자에게 권한 해제 안내를 표시
            Alert.alert(
                '알림 비활성화',
                '알림을 비활성화하려면 시스템 설정에서 직접 변경해야 합니다.',
                [{ text: '확인', onPress: () => { Linking.openSettings(); } }]
            );
        } else {
            // 알림 권한이 비활성화된 경우, 스위치를 켜면 권한 요청
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
                setIsEnabled(true);
            } else {
                Alert.alert(
                    '알림 권한 거부',
                    '알림 권한이 거부되었습니다. 시스템 설정에서 권한을 부여해야 알림을 받을 수 있습니다.',
                    [{ text: '확인', onPress: () => { Linking.openSettings();} }]
                );
            }
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ marginBottom: 10 }}>알림 설정</Text>
            <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        </View>
    );
}

export default NotificationSettingScreen

const styles = StyleSheet.create({})