import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Alert, Color } from "@hongpung/src/common";
import { OwnedSessionCard } from "@hongpung/src/entities/session/ui/OwnedSessionCard/OwnedSessionCard";
import { StepProps } from "@hongpung/react-step-flow";
import { CheckInSteps } from "@hongpung/src/features/session/checkInRoom/model/type";
import { useNavigation } from "@react-navigation/native";

type StartSessionConfirmWidgetProps = StepProps<
  CheckInSteps,
  "StartSessionConfirm"
>;

export const StartSessionConfirmWidget: React.FC<
  StartSessionConfirmWidgetProps
> = ({ stepProps }) => {
  const navigation = useNavigation();
  const { session } = stepProps;
  if (!session) {
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
      <Text style={styles.title}>연습 시작하기</Text>
      <OwnedSessionCard session={session} />
      <View>
        <Text style={styles.sessionTitle}>{session.title}</Text>
        <Text style={styles.question}>연습을 시작할까요?</Text>
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
    color: Color.grey700,
    textAlign: "center",
  },
  sessionTitle: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 22,
    color: Color.green500,
    textAlign: "center",
    marginBottom: 4,
  },
  question: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 22,
    color: Color.grey700,
    textAlign: "center",
  },
});
