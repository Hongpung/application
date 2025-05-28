import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { WEEK_DAYS } from "../../constant/weekDays";
import { Color } from "../../constant/color";

export const WeekDaysRow: React.FC = () => {
  return (
    <View style={styles.weekDaysRow}>
      {WEEK_DAYS.map((day, index) => (
        <Text key={index} style={styles.dayText}>
          {day}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  weekDaysRow: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 4,
    justifyContent: "space-around",
  },
  dayText: {
    width: 28,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey500"],
  },
});
