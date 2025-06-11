import dayjs from "dayjs";
import { useState, useCallback } from "react";
import * as Haptics from "expo-haptics";

export const useMiniCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const handleDateSelect = useCallback((date: Date | null) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(date);
  }, []);

  const incrementMonth = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentMonth((prev) => dayjs(prev).add(1, "month").toDate());
  }, []);

  const decrementMonth = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentMonth((prev) => dayjs(prev).subtract(1, "month").toDate());
  }, []);

  return {
    selectedDate,
    currentMonth,
    handleDateSelect,
    incrementMonth,
    decrementMonth,
  };
};
