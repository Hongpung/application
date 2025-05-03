import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Color } from "../../constant/color";

interface DayCellProps {
  day: number;
  isSelected: boolean;
  hasReservation: boolean;
  reservationColors: string[];
  onPress: () => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  day,
  isSelected,
  hasReservation,
  reservationColors,
  onPress,
}) => {
  return (
    <Pressable
      style={[styles.dayContainer, isSelected && styles.selectedDay]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.calendarText,
          hasReservation && styles.hasReservation,
          isSelected && styles.selectedText,
        ]}
      >
        {day}
      </Text>
      <View style={styles.reservationDots}>
        {reservationColors.slice(0, 3).map((color, i) => (
          <View
            key={`dot-${i}`}
            style={[
              styles.reservationDot,
              { backgroundColor: Color[`${color}500`] },
            ]}
          />
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    display: "flex",
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 5,
  },
  selectedDay: {
    backgroundColor: Color["blue100"],
  },
  calendarText: {
    width: 28,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey300"],
    marginVertical: 2,
  },
  hasReservation: {
    color: Color["grey600"],
  },
  selectedText: {
    color: Color["blue600"],
  },
  reservationDots: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 2,
    gap: 2,
  },
  reservationDot: {
    width: 4,
    height: 4,
    borderRadius: 20,
  },
});
