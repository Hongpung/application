import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { RootStackParamList } from "@hongpung/src/common/navigation";
import dayjs from "dayjs";

export const useFirstPage = () => {
  const [firstScreen, setFirstScreen] = useState<Exclude<
    keyof RootStackParamList,
    "Permission"
  > | null>(null);

  useEffect(() => {
    const defineFirstScreen = async () => {
      // 1. 앱 첫 실행 여부 확인 (최우선)
      const launchFlag = await AsyncStorage.getItem("isLaunched");

      if (!launchFlag) {
        setFirstScreen("Tutorial");
        return;
      }

      // 2. 자동 로그인 설정 확인
      const autoLogin = await AsyncStorage.getItem("autoLogin");
      if (!autoLogin) {
        setFirstScreen("LoginStack");
        return;
      }

      Toast.show({
        type: "success",
        text1: `자동 로그인 되었어요 (${dayjs().format("M월 D일")})`,
        position: "bottom",
        bottomOffset: 60,
        visibilityTime: 3000,
      });
      setFirstScreen("Main");
    };

    defineFirstScreen();
  }, []);

  console.log("firstScreen", firstScreen);
  return { firstScreen };
};
