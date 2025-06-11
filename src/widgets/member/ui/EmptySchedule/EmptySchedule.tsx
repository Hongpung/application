import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Color } from "@hongpung/src/common";

interface EmptyScheduleProps {
  navigateToReservation: () => void;
}

const EmptySchedule: React.FC<EmptyScheduleProps> = ({
  navigateToReservation,
}) => {
  return (
    <View style={[styles.container, { justifyContent: "center" }]}>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>예정된 일정이 없어요!</Text>
        <TouchableOpacity
          onPress={navigateToReservation}
          style={styles.navigateButton}
          activeOpacity={0.85}
        >
          <Text style={styles.navigateText}>{`새 일정 예약하러 가기`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  contentContainer: {
    alignItems: "center",
    gap: 16,
    marginBottom: 120,
  },
  titleText: {
    fontSize: 24,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey800"],
  },
  navigateText: {
    fontSize: 14,
    fontFamily: "NanumSquareNeo-Bold",
    color: "#FFFFFF",
  },
  navigateButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color["blue500"],
    borderRadius: 100,
  },
});

export default EmptySchedule;
