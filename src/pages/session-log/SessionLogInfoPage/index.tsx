import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { Alert, Color, Header } from "@hongpung/src/common";
import { MainStackScreenProps } from "@hongpung/src/common/navigation";

import { useLoadSessionLogFetch } from "@hongpung/src/entities/session-log";
import { SessionLogInfoWidget } from "@hongpung/src/widgets/session-log";
import { debounce } from "lodash";

export const SessionLogInfoPage: React.FC<
  MainStackScreenProps<"SessionLogInfo">
> = ({ navigation, route }) => {
  const { sessionId } = route.params;

  const {
    data: sessionLogs,
    isLoading,
    error,
  } = useLoadSessionLogFetch({
    sessionId,
  });

  const navigateToInstrumentDetail = (instrumentId: number) => {
    navigation.navigate("InstrumentDetail", { instrumentId });
  };

  const debouncedGoBack = debounce(
    () => {
      navigation.goBack();
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );

  useEffect(() => {
    if (error && !isLoading) {
      Alert.alert("오류", "연습 내역을 불러오는 중 오류가 발생했습니다.", {
        onConfirm: debouncedGoBack,
      });
    }
  }, [error, debouncedGoBack, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <Header headerName="연습 내역" LeftButton={"arrow-back"} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Color["blue400"]} />
        </View>
      </View>
    );
  }

  if (!sessionLogs) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Header headerName="연습 내역" LeftButton={"arrow-back"} />
      <SessionLogInfoWidget
        sessionLog={sessionLogs}
        navigateToInstrumentDetail={navigateToInstrumentDetail}
      />
    </View>
  );
};
