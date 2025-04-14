import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { WeekDaysRow } from "./WeekDaysRow";
import { DayCell } from "./DayCell";
import { getDaysInMonth } from "../../lib/getDaysInMonth";

const { width } = Dimensions.get("window");

interface MiniCalendarProps {
  dateItems: { [date: string]: string[] };
  selectedDate: Date | null;
  currentMonth: Date;
  onDateSelect: (date: Date | null) => void;
}

const MiniCalendarBody: React.FC<MiniCalendarProps> = ({
  dateItems,
  currentMonth,
  selectedDate,
  onDateSelect,
}) => {
  const datesInMonth = useMemo(
    () => getDaysInMonth(currentMonth),
    [currentMonth]
  );

  const handleDatePress = (day: number) => {
    if (dateItems[day]) {
      const newDate = new Date(currentMonth);
      newDate.setDate(day);
      onDateSelect(selectedDate?.getDate() === day ? null : newDate);
    }
  };

  return (
    <View style={styles.container}>
      <WeekDaysRow />
      {datesInMonth.map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} style={styles.weekRow}>
          {week.map((date, dateIndex) => {
            if (date === 0) {
              return (
                <View
                  key={`empty-${weekIndex}/${dateIndex}`}
                  style={styles.emptyDay}
                />
              );
            }

            const reservationData = dateItems[date];
            const isSelected = selectedDate?.getDate() === date;

            return (
              <DayCell
                key={`day-${date}`}
                day={date}
                isSelected={isSelected}
                hasReservation={!!reservationData}
                reservationColors={reservationData || []}
                onPress={() => handleDatePress(date)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default MiniCalendarBody;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: (width - 320) / 2,
    gap: 4,
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
