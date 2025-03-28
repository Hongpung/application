import { useCallback } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, useNavigation } from "@react-navigation/native";

import { showLogOutFailToast, showLogOutToast } from "../lib/toast";

export const useLogoutButton = () => {

    const navigation = useNavigation();
    const autoLoginOff = useCallback(async () => {
        await AsyncStorage.removeItem('autoLogin')
    }, [])

    const logoutHandler = async () => {
        try {
            autoLoginOff();
            // await logout();
            showLogOutToast();
            navigation.dispatch(StackActions.replace('Login'));
        } catch (e) {
            showLogOutFailToast()
        }
    }

    return { logoutHandler }
}