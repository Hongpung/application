import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Alert, Color, LongButton } from "@hongpung/src/common";
import { OwnedSessionCard } from "@hongpung/src/entities/session/ui/OwnedSessionCard/OwnedSessionCard";
import { StepProps } from "@hongpung/react-step-flow";
import { CheckInSteps } from "@hongpung/src/features/session/checkInRoom/model/type";
import { useNavigation } from "@react-navigation/native";

type AttendSessionConfirmWidgetProps = StepProps<
  CheckInSteps,
  "AttendSessionConfirm"
>;

export const AttendSessionConfirmWidget: React.FC<
  AttendSessionConfirmWidgetProps
> = ({ stepProps }) => {
  const { session, onAttend } = stepProps;
  const navigation = useNavigation();

  if (!session) {
    Alert.alert("세션 정보를 불러오는데 실패했습니다.", "다시 시도해주세요.", {
      onConfirm: () => {
        navigation.goBack();
      },
      cancelable: false,
    });
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>연습 참가 확인</Text>
        <OwnedSessionCard session={session} />
        <View>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.question}>연습에 참가하시나요?</Text>
        </View>
      </View>
      <LongButton
        innerContent="바로 참가하기"
        onPress={onAttend}
        color={"blue"}
      />
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
    textAlign: "center",
  },
  sessionTitle: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 22,
    color: Color["green500"],
    textAlign: "center",
    marginBottom: 4,
  },
  question: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 22,
    color: Color["grey700"],
    textAlign: "center",
  },
});
