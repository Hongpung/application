import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Color, Icons } from "@hongpung/src/common";

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
      <Pressable onPress={handlePrevMonth} style={styles.button}>
        <Icons name="chevron-back" size={24} color={Color['grey400']} />
      </Pressable>
      <Text style={styles.monthText}>
        {currentMonth.getFullYear()}. {(currentMonth.getMonth() + 1).toString().padStart(2, '0')}
      </Text>
      <Pressable onPress={handleNextMonth} style={styles.button}>
        <Icons name="chevron-forward" size={24} color={Color['grey400']} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 16,
    marginHorizontal: 32
  },
  button: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color.grey800,
    marginHorizontal: 8,
  },
});

export default MiniCalendarHeader;
