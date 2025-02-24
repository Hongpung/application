import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Color } from '@hongpung/ColorSet';
import CustomSwitch from '@hongpung/src/common/components/switch/switch';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LongButton from '@hongpung/src/common/components/buttons/long-button';
import { StackActions, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@hongpung/hoc/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MyPageParamList } from '@hongpung/nav/MyPageStack';

const showLogOutToast = () => {
    Toast.show({
        type: 'success',
        text1: '안전하게 로그아웃 되었어요',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 3000
    });
};
const showLogOutFailToast = () => {
    Toast.show({
        type: 'error',
        text1: '로그아웃에 실패했어요\n 다시 시도해주세요',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 3000
    });
};


type LoginSettingProps = NativeStackNavigationProp<MyPageParamList, 'LoginSetting'>;

const LoginSettingScreen: React.FC = () => {

    const navigation = useNavigation<LoginSettingProps>();

    const { logout } = useAuth();
    const [autoLogin, setAutoLogin] = useState(false);


    useEffect(() => {
        const getAutoLogin = async () => {
            try {
                const prevAutoLogin = await AsyncStorage.getItem('autoLogin') || null
                setAutoLogin(!!prevAutoLogin || false);
            } catch (e) {
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



    const autoLoginOff = useCallback(async () => {
        await AsyncStorage.removeItem('autoLogin')
    }, [])

    const LogOutHandler = async () => {
        try {
            autoLoginOff();
            await logout();
            showLogOutToast();
            navigation.dispatch(StackActions.replace('Login'));
        } catch (e) {
            showLogOutFailToast()
        }
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