import { useFetchBanners } from "@hongpung/hoc/useBanner";
import { useFirstPage } from "@hongpung/hoc/useFirstPage";
import { useFonts } from "./useFonts";
import { useAuth } from "@hongpung/hoc/useAuth";
import { useCallback, useEffect } from "react";
import * as Updates from 'expo-updates';
import { Alert } from "react-native";

const checkUpdate = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      Alert.alert(
        '업데이트 가능',
        '새로운 업데이트가 있습니다. 적용하시겠습니까?',
        [
          { text: '나중에', style: 'cancel' },
          { text: '업데이트', onPress: async () => {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            } 
          },
        ]
      );
    }
  } catch (error) {
    console.error('업데이트 확인 실패:', error);
  }
};

export const useAppLoad = () => {

    const { firstScreen, defineFirstScreen } = useFirstPage();
    const { banners, fetchBanners } = useFetchBanners();
    const { fontLoaded, loadFonts } = useFonts();

    const { logout } = useAuth()

    const initProcess = useCallback(() => {

        checkUpdate();
        
        loadFonts();
        defineFirstScreen();
        fetchBanners();

    }, [])

    useEffect(() => {

        initProcess();

        return () => {

            logout();

        }
    }, [])

    return { firstScreen, fontLoaded, banners };
}