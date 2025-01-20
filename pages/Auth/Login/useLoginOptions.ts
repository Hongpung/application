import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useLoginOptions = ({ setEmail }: { setEmail: (email: string) => void }) => {

    const [saveID, setSaveID] = useState(false);
    const [autoLogin, setAutoLogin] = useState(false);

    useEffect(() => {
        if (autoLogin) setSaveID(true)
    }, [autoLogin])

    useEffect(() => {
        if (!saveID) setAutoLogin(false)
    }, [saveID])

    useEffect(() => {
        const loadLoginSetting = async () => {
            try {
                const loadedAutoLogin = await AsyncStorage.getItem('autoLogin')//오토 로그인 로두
                setAutoLogin(loadedAutoLogin != null);

                if (loadedAutoLogin == null) {
                    const loadedSaveID = await AsyncStorage.getItem('saveID')//아이디 세이브인지 확인
                    setSaveID(loadedSaveID != null);

                    if (loadedSaveID) {
                        const loadedEmail = await AsyncStorage.getItem('Email') || '';
                        setEmail(loadedEmail)
                    }

                    return;
                }
                else {
                    const loadedEmail = await AsyncStorage.getItem('Email') || '';
                    setEmail(loadedEmail)

                    return;
                }
            } catch (e) { console.error(e) }
        }

        loadLoginSetting()
    }, [])

    return { saveID, setSaveID, autoLogin, setAutoLogin }
}