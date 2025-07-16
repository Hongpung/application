import { useMemo } from "react";
import { View, Text, ImageBackground, Platform } from "react-native";
import Toast from "react-native-toast-message";

import * as SplashScreen from "expo-splash-screen";
import { Provider as JotaiProvider } from "jotai";

import { Color, toastConfig, AlertModal, store } from "@hongpung/src/common";
import { initializeSentry } from "@hongpung/src/common/config/sentry.config";
import "@hongpung/src/common/config/dayjs.config";

import { RootStackNavigation } from "@hongpung/src/navigation";

import { SafeZone } from "./SafeZone";
import { useFonts } from "./lib/useFonts";
import { useFirstPage } from "./lib/useFirstPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Sentry 초기화
initializeSentry();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 3,
    },
  },
});

export const AppContainer: React.FC = () => {
  const { firstScreen } = useFirstPage();
  const { fontLoaded } = useFonts();

  if (Platform.OS === "android") SplashScreen.preventAutoHideAsync();

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
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={store}>
        <SafeZone style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          <AlertModal />
          <RootStackNavigation startDomain={firstScreen} />
          <Toast config={toastConfig} />
        </SafeZone>
      </JotaiProvider>
    </QueryClientProvider>
  );
};
