import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Color } from '@hongpung/ColorSet';
import CustomSwitch from '@hongpung/components/CustomSwitch';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LongButton from '@hongpung/components/buttons/LongButton';
import { StackActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@hongpung/hoc/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginSettingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { logout } = useAuth();
    const [autoLogin, setAutoLogin] = useState(false);

    useEffect(() => {
        const getAutoLogin = async () => {
            try {
                const prevAutoLogin = await AsyncStorage.getItem('autoLogin') ?? null
                setAutoLogin(prevAutoLogin != null ?? false);
            } catch (e) {
                console.error(e)
                setAutoLogin(false)
            }
        }
        getAutoLogin();
    }, []);

    useEffect(() => {
        const removeAutoLogin = async () => {
            try {
                await AsyncStorage.removeItem('autoLogin')
            } catch (e) {
                console.error(e)
                setAutoLogin(false)
            }
        }

        if (autoLogin)
            AsyncStorage.setItem('autoLogin', 'true');

        else removeAutoLogin();
    }, [autoLogin]);

    const showLogOutToast = () => {
        Toast.show({
            type: 'success',
            text1: '안전하게 로그아웃 되었어요',
            position: 'bottom',
            bottomOffset: 60,
            visibilityTime: 3000
        });
    };
    const LogOutHandler = () => {
        logout();
        showLogOutToast();
        navigation.dispatch(StackActions.replace('Login'));
    }

    return (
        <GestureHandlerRootView>
            <View>
                <View style={{ height: 24 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 36, justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'NanumSquareNeo-Bold', color: Color['grey700'], fontSize: 16 }}>자동 로그인 설정</Text>
                    <CustomSwitch
                        onChange={setAutoLogin}
                        value={autoLogin}
                    />
                </View>
                <View style={{ height: 24 }} />
                <LongButton color='red' innerText='로그아웃' isAble={true} onPress={LogOutHandler} />
            </View>
        </GestureHandlerRootView>
    );
}

export default LoginSettingScreen;