import { getToken } from "@hongpung/src/common/lib/TokenHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { RootStackParamList } from "@hongpung/src/common/navigation";

export const useFirstPage = () => {
  const [firstScreen, setFirstScreen] = useState<
    Exclude<keyof RootStackParamList, "Permission"> | null
  >(null);

  useEffect(() => {
    const defineFirstScreen = async () => {
      const launchFlag = await AsyncStorage.getItem("isLaunched");
      if (!launchFlag) setFirstScreen("Tutorial");
      else {
        const autoLogin = await AsyncStorage.getItem("autoLogin");
        if (!!autoLogin) {
          const token = await getToken("token");

          if (token) {
            setFirstScreen("Main");
            Toast.show({
              type: "success",
              text1:
                "자동 로그인 되었어요" +
                `(${(new Date().getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}월${new Date()
                  .getDate()
                  .toString()
                  .padStart(2, "0")})일`,
              position: "bottom",
              bottomOffset: 60,
              visibilityTime: 3000,
            });
          } else {
            setFirstScreen("LoginStack");
            Toast.show({
              type: "fail",
              text1: "자동 로그인이 만료되었어요.\n다시 로그인 해주세요.",
              position: "bottom",
              bottomOffset: 60,
              visibilityTime: 3000,
            });
          }
        } else setFirstScreen("LoginStack");
      }
    };

    defineFirstScreen();
  }, []);

  return { firstScreen };
};
