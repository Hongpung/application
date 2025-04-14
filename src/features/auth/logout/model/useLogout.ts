import { StackActions, useNavigation } from "@react-navigation/native";
import { useLogoutRequest } from "../api/logoutApi";
import { showLogOutFailToast, showLogOutToast } from "../lib/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useLogout = () => {
    const navigation = useNavigation();
    const { request: logoutRequest, isLoading } = useLogoutRequest();

    const LogOutHandler = async () => {
        try {
            await logoutRequest();
            await AsyncStorage.removeItem("autoLogin");
            showLogOutToast();
            navigation.dispatch(StackActions.replace("Login"));
        } catch (e) {
            showLogOutFailToast();
        }
    };

    return { LogOutHandler, isLoading };
};

export default useLogout;

