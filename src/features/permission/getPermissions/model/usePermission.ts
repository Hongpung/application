import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { Alert, Platform } from "react-native";
import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@hongpung/pageTypes";

type PermissionNavigation = NativeStackNavigationProp<RootStackParamList, 'Permission'>;

const usePermission = () => {
    const navigation = useNavigation<PermissionNavigation>();

    const PermissionHandler = async () => {
        if (Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version >= 33)) {
            await Notifications.requestPermissionsAsync();
        }
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

        if (cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted') {
            await AsyncStorage.setItem('isLaunched', 'true');

        } else {
            Alert.alert('권한 획득 실패', '앱 사용에 필요한 권한을 획득해주세요.');
        }
        //관계 없이 넘어가야함 appstore 심사에 걸림
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });

    }

    return { PermissionHandler };
}

export default usePermission;
