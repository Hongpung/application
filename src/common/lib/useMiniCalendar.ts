import { useState, useCallback } from 'react';

export const useMiniCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const handleDateSelect = useCallback((date: Date | null) => {
    setSelectedDate(date);
  }, []);

  const handleMonthChange = useCallback((date: Date) => {
    setCurrentMonth(date);
  }, []);

  return {
    selectedDate,
    currentMonth,
    handleDateSelect,
    handleMonthChange,
  };
}; 