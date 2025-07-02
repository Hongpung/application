import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Color } from "@hongpung/src/common";
import { Session } from "@hongpung/src/entities/session";

interface CheckInEmptySessionCardProps {
  nextSession?: Session | null;
}

export const CheckInEmptySessionCard: React.FC<
  CheckInEmptySessionCardProps
> = ({ nextSession }) => (
  <View style={styles.emptySessionCard}>
    <Text style={styles.emptyTitle}>이 시간은 예약이 없어요</Text>
    <Text style={styles.emptyMessage}>바로 사용할 수 있어요</Text>
    <Text style={styles.nextSessionTime}>
      {"다음 예약 시간 : "}
      {nextSession ? nextSession.startTime : "없음"}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  emptySessionCard: {
    width: 320,
    height: 180,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Color.grey100,
    marginVertical: 24,
    overflow: "hidden",
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 20,
    color: Color.grey600,
  },
  emptyMessage: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 16,
    lineHeight: 24,
    color: Color.grey400,
  },
  nextSessionTime: {
    position: "absolute",
    bottom: 24,
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 16,
    lineHeight: 24,
    color: Color.grey400,
  },
});
