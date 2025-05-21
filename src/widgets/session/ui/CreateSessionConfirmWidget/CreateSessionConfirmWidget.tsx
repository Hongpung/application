import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Color, LongButton } from "@hongpung/src/common";
import { Switch } from "@hongpung/src/common";
import { CheckInEmptySessionCard } from "@hongpung/src/entities/session/ui/CheckInEmptySessionCard/CheckInEmptySessionCard";
import { ReservationSession } from "@hongpung/src/entities/session";

interface CreateSessionConfirmWidgetProps {
  nextSession: ReservationSession | null;
  participationAvailable: boolean;
  onParticipationAvailableChange: (value: boolean) => void;
}

export const CreateSessionConfirmWidget: React.FC<
  CreateSessionConfirmWidgetProps
> = ({
  nextSession,
  participationAvailable,
  onParticipationAvailableChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>바로 사용하기</Text>
      <CheckInEmptySessionCard nextSession={nextSession} />
      <View>
        <Text style={styles.availableTime}>
          {nextSession
            ? `${nextSession.startTime.slice(
                0,
                2
              )}시 ${nextSession.startTime.slice(-2)}분 까지 사용하실 수 있어요`
            : "제한 없이 사용할 수 있어요"}
        </Text>
        <Text style={styles.question}>시작하시겠어요?</Text>
        <View style={styles.switchContainer}>
          <Text
            style={[
              styles.switchText,
              {
                color: participationAvailable
                  ? Color["green500"]
                  : Color["red500"],
              },
            ]}
          >
            {participationAvailable ? "열린 연습" : "참여 불가"}
          </Text>
          <Switch
            value={participationAvailable}
            onChange={onParticipationAvailableChange}
          />
        </View>
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
    textAlign: "center",
  },
  availableTime: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 18,
    color: Color["blue500"],
    textAlign: "center",
    marginBottom: 4,
  },
  question: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 18,
    color: Color["grey700"],
    textAlign: "center",
  },
  switchContainer: {
    marginTop: 64,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  switchText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 14,
  },
});
