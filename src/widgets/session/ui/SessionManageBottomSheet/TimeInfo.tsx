import { Color } from "@hongpung/ColorSet";
import { View, Text, StyleSheet } from "react-native";
import { SessionTimer } from "@hongpung/src/features/session/useRoom/ui/SessionTimer/SessionTimer";
import React from "react";

interface TimeInfoProps {
  startTime: string;
  endTime: string;
  remainingHour: string;
  remainingMinute: string;
}

export const TimeInfo = ({ startTime, endTime, remainingHour, remainingMinute }: TimeInfoProps) => {
  return (
    <>
      <View style={styles.timeInfo}>
        <Text style={styles.timeLabel}>남은 예약 시간</Text>
        <Text style={styles.timeRange}>
          ({startTime}~{endTime})
        </Text>
      </View>
      <SessionTimer
        remainingHour={remainingHour}
        remainingMinute={remainingMinute}
      />
    </>
  );
};

const styles = StyleSheet.create({
  timeInfo: {
    justifyContent: "center",
    height: 64,
    alignItems: "center",
    gap: 4,
  },
  timeLabel: {
    fontFamily: "NanumSquareNeo-Bold",
    color: "#FFF",
    fontSize: 14,
  },
  timeRange: {
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey300"],
    fontSize: 12,
  },
}); 