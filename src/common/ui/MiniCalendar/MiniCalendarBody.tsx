import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { WeekDaysRow } from "./WeekDaysRow";
import { getDaysInMonth } from "../../lib/getDaysInMonth";
import dayjs from "dayjs";
import { WeekRow } from "./WeekRow";

const { width } = Dimensions.get("window");

interface MiniCalendarProps {
  dateItems: { [date: string]: string[] };
  selectedDate: Date | null;
  currentMonth: Date;
  onDateSelect: (date: Date | null) => void;
  collapsed: boolean;
}

const MiniCalendarBody: React.FC<MiniCalendarProps> = ({
  dateItems,
  currentMonth,
  selectedDate,
  onDateSelect,
  collapsed,
}) => {
  const datesInMonth = useMemo(
    () => getDaysInMonth(currentMonth),
    [currentMonth],
  );

  const handleDatePress = (day: number) => {
    if (dateItems[day]) {
      const newDate = dayjs(currentMonth).date(day).toDate();
      onDateSelect(selectedDate?.getDate() === day ? null : newDate);
    }
  };

  return (
    <View style={styles.container}>
      <WeekDaysRow />

      {datesInMonth.map((week, weekIndex) => (
        <WeekRow
          collapsed={collapsed}
          key={`week-${weekIndex}`}
          week={week}
          weekIndex={weekIndex}
          dateItems={dateItems}
          selectedDate={selectedDate}
          onDatePress={handleDatePress}
        />
      ))}
    </View>
  );
};

export default MiniCalendarBody;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: (width - 320) / 2,
  },
  weekRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  emptyDay: {
    width: 32,
    height: 32,
  },
});
