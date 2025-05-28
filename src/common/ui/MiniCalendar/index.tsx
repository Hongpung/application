import { View } from "react-native";
import MiniCalendarBody from "./MiniCalendarBody";
import MiniCalendarHeader from "./MiniCalendarHeader";
import React, { useState, useImperativeHandle, useEffect } from "react";

interface MiniCalendarProps {
  dateItems: { [date: string]: string[] };
  currentMonth: Date;
  onDateSelect: (date: Date | null) => void;
  incrementMonth: () => void;
  decrementMonth: () => void;
  ref: React.Ref<MiniCalendarRef>;
}

export interface MiniCalendarRef {
  getCollapsed: () => boolean;
  setCollapsed: (collapsed: boolean) => void;
  focusDate: (date: Date | null) => void;
  getCurrentFocusedDate: () => Date | null;
}

const MiniCalendar: React.FC<MiniCalendarProps> = (props) => {
  const {
    dateItems,
    currentMonth,
    onDateSelect,
    incrementMonth,
    decrementMonth,
    ref,
  } = props;

  // 스크롤에 의한 관리
  const [collapsed, setCollapsed] = useState(false);

  // 유저가 펼치기 접기 제스쳐를 통해 관리
  const [collapsedMode, setCollapsedMode] = useState(true);

  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  // 유저의 제스쳐 처리를 위한 상태
  const [touchStartPoint, setTouchStartPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // 외부에서 날짜 포커스를 제어할 수 있는 API 제공
  useImperativeHandle(
    ref,
    () => ({
      getCollapsed: () => collapsed,
      setCollapsed: (collapsed: boolean) => {
        setCollapsed(collapsed);
      },
      focusDate: (date: Date | null) => {
        setFocusedDate(date);
      },
      getCurrentFocusedDate: () => focusedDate,
    }),
    [focusedDate, collapsed],
  );

  // 캘린더 월 변경 시 초기화
  useEffect(() => {
    setCollapsedMode(true);
    setFocusedDate(null);
  }, [currentMonth]);

  useEffect(() => {
    if (!focusedDate) setCollapsedMode(true);
  }, [focusedDate]);

  const handleTouchStart = (e: any) => {
    const touch = e.nativeEvent.touches[0];
    setTouchStartPoint({ x: touch.pageX, y: touch.pageY });
  };

  const handleTouchEnd = (e: any) => {
    if (!touchStartPoint) return;

    const touch = e.nativeEvent.changedTouches[0];
    const deltaY = touch.pageY - touchStartPoint.y;
    const deltaX = touch.pageX - touchStartPoint.x;

    // 아래로 스와이프 감지 (세로 이동이 가로 이동보다 크고, 아래쪽으로 50px 이상)
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 80) {
      setCollapsedMode(false);
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -80) {
      setCollapsedMode(true);
    }

    setTouchStartPoint(null);
  };

  return (
    <View
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: "relative", zIndex: 10, paddingBottom: 16 }}
    >
      <MiniCalendarHeader
        currentMonth={currentMonth}
        incrementMonth={incrementMonth}
        decrementMonth={decrementMonth}
      />
      <MiniCalendarBody
        collapsed={collapsed && collapsedMode}
        dateItems={dateItems}
        selectedDate={focusedDate}
        currentMonth={currentMonth}
        onDateSelect={onDateSelect}
      />
    </View>
  );
};

export default React.memo(MiniCalendar);
