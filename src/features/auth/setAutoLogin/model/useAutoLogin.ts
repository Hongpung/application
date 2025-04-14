import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";
import { turnOnAutoLoginSuccessToast, turnOnAutoLoginFailedToast, turnOffAutoLoginSuccessToast, turnOffAutoLoginFailedToast } from "../lib/toast";

const useAutoLogin = () => {
    const [autoLogin, setAutoLogin] = useState(false);

    useEffect(() => {
        const getAutoLogin = async () => {
            try {
                const prevAutoLogin = (await AsyncStorage.getItem("autoLogin")) || null;
                setAutoLogin(!!prevAutoLogin || false);
            } catch (e) {
                setAutoLogin(false);
            }
        };

        getAutoLogin();
    }, []);

    const turnOnAutoLogin = useCallback(async () => {
        try {
            await AsyncStorage.setItem("autoLogin", "true");
            turnOnAutoLoginSuccessToast();
        } catch (e) {
            console.error(e);
            setAutoLogin(false);
            turnOnAutoLoginFailedToast();
        }
    }, []);

    const turnOffAutoLogin = async () => {
        try {
            await AsyncStorage.removeItem("autoLogin");
            turnOffAutoLoginSuccessToast();
        } catch (e) {
            console.error(e);
            setAutoLogin(true);
            turnOffAutoLoginFailedToast();
        }
    };

    useEffect(() => {
        if (autoLogin) turnOnAutoLogin();
        else turnOffAutoLogin();
    }, [autoLogin]);

    return [autoLogin, setAutoLogin] as const;
};

export default useAutoLogin;

