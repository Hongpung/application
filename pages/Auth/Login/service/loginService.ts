// src/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export const saveLoginOptions = async ({ email, autoLogin, saveID }: { email: string, autoLogin: boolean, saveID: boolean }) => {
    if (autoLogin) {
        await AsyncStorage.setItem('autoLogin', 'true');
        await AsyncStorage.setItem('saveID', 'true');
        await AsyncStorage.setItem('Email', email);
        Toast.show({
            type: 'success',
            text1: '앞으로 앱 실행시 자동으로 로그인 돼요',
            position: 'bottom',
            bottomOffset: 60,
            visibilityTime: 3000
        });
    } else if (saveID) {
        const storedAutoLogin = await AsyncStorage.getItem('autoLogin');
        if (storedAutoLogin) {
            await AsyncStorage.removeItem('autoLogin');
        }
        await AsyncStorage.setItem('saveID', 'true');
        await AsyncStorage.setItem('Email', email);
        Toast.show({
            type: 'success',
            text1: '아이디를 저장했어요',
            position: 'bottom',
            bottomOffset: 60,
            visibilityTime: 3000
        });
    } else {
        const storedSaveID = await AsyncStorage.getItem('saveID');
        if (storedSaveID) {
            await AsyncStorage.removeItem('saveID');
        }
    }
};
