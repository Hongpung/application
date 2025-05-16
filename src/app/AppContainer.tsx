import { Color, toastConfig } from "@hongpung/src/common";
import { View, Text, ImageBackground, Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { SafeZone } from "./SafeZone";
import { RootStackNavigation } from "@hongpung/src/navigation";
import Toast from "react-native-toast-message";
import { useMemo } from "react";
import { useFonts } from "./lib/useFonts";
import { useFirstPage } from "./lib/useFirstPage";

export const AppContainer: React.FC = () => {
  const { firstScreen } = useFirstPage();
  const { fontLoaded } = useFonts();

  if (Platform.OS == "android") SplashScreen.preventAutoHideAsync();

  const getLoadingText = useMemo(() => {
    if (!fontLoaded) return "폰트 로딩중";
    if (!firstScreen) return "기본 정보 로딩중";
    return "";
  }, [fontLoaded, firstScreen]);

  if (!fontLoaded || !firstScreen) {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require("@hongpung/assets/splash.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          onLoadEnd={SplashScreen.hideAsync}
        />
        <Text
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            color: Color["grey400"],
            fontFamily: "NanumSquareNeo-Bold",
          }}
        >
          {getLoadingText}
        </Text>
      </View>
    );
  }

  return (
    <SafeZone style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <RootStackNavigation startDomain={firstScreen} />
      <Toast config={toastConfig} />
    </SafeZone>
  );
};
