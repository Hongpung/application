import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";

export const useFirstPage = () => {
    const [firstScreen, setFirstScreen] = useState<"Tutorial" | "Login" | "HomeStack" | null>(null);

    const defineFirstScreen = useCallback(async () => {
        const launchFlag = await AsyncStorage.getItem('isLaunched');
        if (!launchFlag) setFirstScreen("Tutorial")
        else {
            const autoLogin = await AsyncStorage.getItem('autoLogin');
            if (autoLogin) {

                const token = null;//await getToken('token');
                if (token) {
                    setFirstScreen('HomeStack')
                    Toast.show({
                        type: 'success',
                        text1: '자동 로그인 되었어요' + `(${(new Date().getMonth() + 1).toString().padStart(2, '0')}월${(new Date().getDate()).toString().padStart(2, '0')})일`,
                        position: 'bottom',
                        bottomOffset: 60,
                        visibilityTime: 3000
                    });
                }

                else {
                    setFirstScreen('Login')
                    Toast.show({
                        type: 'fail',
                        text1: '자동 로그인이 만료되었어요.\n다시 로그인 해주세요.',
                        position: 'bottom',
                        bottomOffset: 60,
                        visibilityTime: 3000
                    });
                }
            }
            else setFirstScreen('Login');
        }
    },[])

    return { firstScreen, defineFirstScreen }
}