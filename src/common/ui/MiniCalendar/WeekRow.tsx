import { Animated, StyleSheet, View } from "react-native";
import { DayCell } from "./DayCell";
import { useEffect, useRef } from "react";

interface WeekRowProps {
  week: number[];
  weekIndex: number;
  dateItems: { [date: string]: string[] };
  selectedDate: Date | null;
  onDatePress: (date: number) => void;
  collapsed: boolean;
}

export const WeekRow: React.FC<WeekRowProps> = ({
  week,
  weekIndex,
  dateItems,
  selectedDate,
  onDatePress,
  collapsed,
}) => {
  const height = useRef(new Animated.Value(32)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const paddingVertical = useRef(new Animated.Value(4)).current;

  useEffect(() => {
    if (selectedDate === null || !collapsed) {
      Animated.parallel([
        Animated.timing(height, {
          toValue: 32,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(paddingVertical, {
          toValue: 4,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      const nextOpen = week.includes(selectedDate?.getDate() || 0);
      Animated.parallel([
        Animated.timing(height, {
          toValue: nextOpen ? 32 : 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: nextOpen ? 1 : 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(paddingVertical, {
          toValue: nextOpen ? 8 : 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [week, selectedDate, collapsed, height, opacity, paddingVertical]);

  return (
    <Animated.View
      key={`week-${weekIndex}`}
      style={[styles.weekRow, { opacity, height, paddingVertical }]}
    >
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
            onPress={() => onDatePress(date)}
          />
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
