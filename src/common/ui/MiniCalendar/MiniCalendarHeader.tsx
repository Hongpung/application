import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Color } from "../../constant/color";
import { Icons } from "../Icons/Icons";

interface MiniCalendarHeaderProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const MiniCalendarHeader: React.FC<MiniCalendarHeaderProps> = ({
  currentMonth,
  onMonthChange,
}) => {
  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.yearText}>{currentMonth.getFullYear()}년</Text>
      <View style={styles.monthContainer}>
        <Pressable onPress={handlePrevMonth} style={styles.button}>
          <Icons name="chevron-back" size={24} color={Color["blue500"]} />
        </Pressable>
        <Text style={styles.monthText}>{currentMonth.getMonth() + 1}월</Text>
        <Pressable onPress={handleNextMonth} style={styles.button}>
          <Icons name="chevron-forward" size={24} color={Color["blue500"]} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 16,
    marginHorizontal: 32,
  },
  button: {
    padding: 4,
  },
  yearText: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey400"],
    paddingHorizontal: 12,
  },
  monthText: {
    fontSize: 20,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey800"],
    marginHorizontal: 8,
  },
  monthContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MiniCalendarHeader;
