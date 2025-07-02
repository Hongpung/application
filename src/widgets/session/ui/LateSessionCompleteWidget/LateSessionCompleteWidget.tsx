import LottieView from "lottie-react-native";
import { View, StyleSheet, Text } from "react-native";

import dayjs from "dayjs";

import { Alert, Color } from "@hongpung/src/common";

import { timeToDate } from "@hongpung/src/entities/session";
import { StepProps } from "@hongpung/react-step-flow";
import { CheckInSteps } from "@hongpung/src/features/session/checkInRoom";
import { useNavigation } from "@react-navigation/native";

type LateSessionCompleteWidgetProps = StepProps<
  CheckInSteps,
  "LateSessionComplete"
>;

export const LateSessionCompleteWidget: React.FC<
  LateSessionCompleteWidgetProps
> = ({ stepProps }) => {
  const navigation = useNavigation();
  const { startTime } = stepProps ?? { startTime: new Date().toISOString() };
  console.log("startTime", startTime);
  console.log("stepProps", stepProps);

  if (!startTime) {
    Alert.alert("오류", "이용 정보가 없습니다.", {
      onConfirm: () => {
        navigation.goBack();
      },
      cancelable: false,
    });
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>연습 출석 완료</Text>
      <View
        style={{
          width: 400,
          height: 300,
          marginVertical: 24,
          overflow: "hidden",
          alignSelf: "center",
        }}
      >
        <LottieView
          source={require("@hongpung/assets/lotties/YellowCard.json")}
          style={{ width: "100%", height: "100%" }}
          autoPlay
          speed={0.8}
        />
      </View>
      <View style={{ flexDirection: "column", alignItems: "center", gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Bold",
              fontSize: 22,
              color: Color["red500"],
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            {dayjs().diff(dayjs(timeToDate(startTime)), "minutes")}
          </Text>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Bold",
              fontSize: 22,
              color: Color["grey700"],
              textAlign: "center",
              marginBottom: 4,
            }}
          >{`분`}</Text>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Bold",
              fontSize: 22,
              color: Color["red500"],
              textAlign: "center",
              marginBottom: 4,
            }}
          >{` 지각`}</Text>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Bold",
              fontSize: 22,
              color: Color["grey700"],
              textAlign: "center",
              marginBottom: 4,
            }}
          >{`했어요!`}</Text>
        </View>
        <Text
          style={{
            fontFamily: "NanumSquareNeo-Bold",
            fontSize: 22,
            color: Color["grey700"],
            textAlign: "center",
          }}
        >{`그래도 눈치보지 말고 연습하세요~`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  title: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 22,
    color: Color["grey700"],
  },
});
