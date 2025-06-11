import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  GestureResponderEvent,
} from "react-native";
import { Color } from "../../constant/color";
import { Icons } from "../Icons/Icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";

type WeekCalendarHeaderProps = {
  selectedDate: Date;
  changeDate: (selectedDate: Date) => void;
  onPressBackButton: () => void;
  isLimit?: boolean;
  RightButton?: React.ReactNode;
};

const WEEK_WIDTH = 276;
const WEEK_PADDING = 6;
const WEEK_CONTAINER_WIDTH = WEEK_WIDTH - WEEK_PADDING * 2;

const { width: deviceWidth } = Dimensions.get("window");

export const WeekCalendarHeader: React.FC<WeekCalendarHeaderProps> = ({
  selectedDate,
  changeDate,
  onPressBackButton,
  isLimit = false,
  RightButton,
}) => {
  // 실제 선택 가능 필드
  const [weekDate, setWeekDate] = useState<Date>(selectedDate);
  // 애니메이션 주간 날짜 관리
  const [bgWeekDate, setBgWeekDate] = useState<Date>(selectedDate);

  // 오늘 날짜 관련 값들을 안정적으로 관리 (매 렌더링마다 계산하지만 참조 안정화)
  const today = useMemo(() => dayjs(), []);

  const disabledTime = useMemo(() => {
    return today.add(2, "hour");
  }, [today]);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // 애니메이션 관련 상태 (각 주간 뷰별로 분리)
  const translateX = useRef(new Animated.Value(0)).current;
  const translateXValue = useRef<number>(0);
  const opacity = useRef(new Animated.Value(1)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  // 애니메이션 실행 함수 (부드러운 전환을 위해 중간에 데이터 변경)
  const animateWeekTransition = (
    direction: "left" | "right",
    callback: () => void,
  ) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const currentValue = translateXValue.current;
    const toValue =
      currentValue + (direction === "left" ? -WEEK_WIDTH : WEEK_WIDTH);

    Animated.timing(translateX, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      // 애니메이션 완료 후 즉시 원래 위치로 복원
      callback();
      translateX.setValue(0);
      translateXValue.current = 0;
      setIsAnimating(false);
    });
  };

  const handleSwipe = (e: GestureResponderEvent) => {
    if (isAnimating) return;

    const moveX = e.nativeEvent.changedTouches[0].pageX;
    const diff = moveX - touchStartX.current;

    opacity.setValue(0);
    // 스와이프 범위 제한하여 부드러운 움직임 보장
    const maxSwipeDistance = WEEK_WIDTH * 0.8;
    const limitedDiff = Math.max(
      -maxSwipeDistance,
      Math.min(maxSwipeDistance, diff),
    );

    const newValue = translateXValue.current + limitedDiff;
    translateX.setValue(newValue);
  };

  const datesOfWeek = useCallback((weekDate: Date) => {
    const week = [];
    // 월요일부터 시작하는 주간 계산 (더 안정적인 방법)
    const currentDayjs = dayjs(weekDate);
    const dayOfWeek = currentDayjs.day(); // 0=일요일, 1=월요일, ..., 6=토요일

    // 해당 주의 월요일 찾기
    const startOfWeek = currentDayjs.subtract(
      dayOfWeek === 0 ? 6 : dayOfWeek - 1,
      "day",
    );

    for (let i = 0; i < 7; i++) {
      const currentDate = startOfWeek.add(i, "day");
      week.push(currentDate);
    }
    return week;
  }, []);

  const incrementMonth = () => {
    const nextMonth = dayjs(weekDate).add(1, "month").toDate();
    setWeekDate(nextMonth);
  };

  const decrementMonth = () => {
    const prevMonth = dayjs(weekDate).subtract(1, "month").toDate();
    setWeekDate(prevMonth);
  };

  const prevWeek = () => {
    const lastDay = dayjs(weekDate).subtract(7, "day").toDate();
    opacity.setValue(0);
    setWeekDate(lastDay);
    animateWeekTransition("right", () => {
      opacity.setValue(1);
      setBgWeekDate(lastDay);
    });
  };

  const nextWeek = () => {
    const nextDay = dayjs(weekDate).add(7, "day").toDate();
    opacity.setValue(0);
    setWeekDate(nextDay);
    animateWeekTransition("left", () => {
      opacity.setValue(1);
      setBgWeekDate(nextDay);
    });
  };

  const onDayCellPress = (date: Date) => {
    const isClickable = !isLimit || dayjs(date).isAfter(disabledTime);
    if (isClickable && !isAnimating) {
      changeDate(date);
      setWeekDate(date);
      setBgWeekDate(date);
    }
  };

  return (
    <View>
      <View
        style={{
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFF",
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 11,
            left: 22,
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Pressable
            onPress={() => {
              if (onPressBackButton) {
                onPressBackButton();
              }
            }}
            style={{
              width: 28,
              height: 28,
            }}
          >
            <Icons name="calendar-outline" size={24} color={Color["blue500"]} />
          </Pressable>
          {!(
            dayjs(weekDate).isSame(today, "week") ||
            dayjs(weekDate).day(0).isSame(selectedDate, "day")
          ) && (
            <Pressable
              onPress={() => {
                setWeekDate(today.toDate());
                setBgWeekDate(today.toDate());
                changeDate(today.toDate());
              }}
              style={{
                height: 28,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 8,
                borderRadius: 5,
                backgroundColor: Color["blue100"],
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "NanumSquareNeo-Bold",
                  color: Color["blue500"],
                }}
              >
                오늘
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.MonthRow}>
          <Pressable
            style={styles.MonthBtn}
            onPress={() => !isAnimating && decrementMonth()}
          >
            <Icons size={24} name={"caret-back"} color={Color["grey300"]} />
          </Pressable>

          <Text style={styles.MonthNumber}>
            {dayjs(weekDate).format("M월")}
          </Text>

          <Pressable
            style={styles.MonthBtn}
            onPress={() => !isAnimating && incrementMonth()}
          >
            <Icons size={24} name={"caret-forward"} color={Color["grey300"]} />
          </Pressable>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            right: 22,
            height: 28,
          }}
        >
          {RightButton}
        </View>
      </View>
      <View
        style={{
          marginHorizontal: 32,
          width: deviceWidth - 64,
          alignItems: "center",
        }}
      >
        <View style={{ height: 4 }} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: WEEK_CONTAINER_WIDTH,
          }}
        >
          <Text style={styles.DayText}>월</Text>
          <Text style={styles.DayText}>화</Text>
          <Text style={styles.DayText}>수</Text>
          <Text style={styles.DayText}>목</Text>
          <Text style={styles.DayText}>금</Text>
          <Text style={styles.DayText}>토</Text>
          <Text style={styles.DayText}>일</Text>
        </View>

        <View style={{ height: 4 }} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
          }}
        >
          <Pressable
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 32,
              width: 32,
              zIndex: 100,
            }}
            onPress={() => !isAnimating && prevWeek()}
          >
            <Icons size={24} name={"chevron-back"} color={Color["blue500"]} />
          </Pressable>
          <View
            onTouchStart={(e) => {
              if (isAnimating) return;
              touchStartX.current = e.nativeEvent.touches[0].pageX;
              touchEndX.current = e.nativeEvent.touches[0].pageX;
            }}
            onTouchMove={handleSwipe}
            onTouchEnd={(e) => {
              if (isAnimating) return;

              const endX = e.nativeEvent.changedTouches[0].pageX;
              const diff = endX - touchStartX.current;
              const minSwipeDistance = 100;

              if (Math.abs(diff) >= minSwipeDistance) {
                if (diff > 0) {
                  prevWeek();
                } else {
                  nextWeek();
                }
              } else {
                // 스와이프 취소 - 원래 위치로 부드럽게 복원
                setIsAnimating(true);
                Animated.timing(translateX, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: false,
                }).start(() => {
                  opacity.setValue(1);
                  translateXValue.current = 0;
                  setIsAnimating(false);
                });
              }
            }}
            style={{
              width: WEEK_CONTAINER_WIDTH,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Animated.View
              key="pressable-section"
              style={[
                {
                  inset: 0,
                  position: "absolute",
                  height: 32,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: WEEK_CONTAINER_WIDTH,
                  overflow: "hidden",
                  opacity,
                  backgroundColor: "#FFF",
                  zIndex: 100,
                },
              ]}
            >
              {datesOfWeek(weekDate).map((date) => {
                // 각 날짜별로 스타일 조건을 미리 계산
                return (
                  <DayCell
                    key={date.format("YYYY-MM-DD")}
                    date={date.toDate()}
                    selectedDate={selectedDate}
                    disabledTime={disabledTime.toDate()}
                    onPress={onDayCellPress}
                  />
                );
              })}
            </Animated.View>
            <Animated.View
              key="prev-week-section"
              style={[
                {
                  height: 32,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: WEEK_WIDTH,
                  overflow: "hidden",
                  transform: [{ translateX }],
                  paddingHorizontal: WEEK_PADDING,
                },
              ]}
            >
              {datesOfWeek(bgWeekDate).map((date) => {
                // 각 날짜별로 스타일 조건을 미리 계산
                const prevDate = date.subtract(7, "day");

                return (
                  <DayCell
                    key={prevDate.format("YYYY-MM-DD")}
                    date={prevDate.toDate()}
                    selectedDate={selectedDate}
                    disabledTime={disabledTime.toDate()}
                  />
                );
              })}
            </Animated.View>
            <Animated.View
              key="current-week-section"
              style={[
                {
                  height: 32,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  overflow: "hidden",
                  width: WEEK_WIDTH,
                  transform: [{ translateX }],
                  paddingHorizontal: WEEK_PADDING,
                },
              ]}
            >
              {datesOfWeek(bgWeekDate).map((date) => {
                // 각 날짜별로 스타일 조건을 미리 계산
                return (
                  <DayCell
                    key={date.format("YYYY-MM-DD")}
                    date={date.toDate()}
                    selectedDate={selectedDate}
                    disabledTime={disabledTime.toDate()}
                  />
                );
              })}
            </Animated.View>
            <Animated.View
              key="next-week-section"
              style={[
                {
                  height: 32,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: WEEK_WIDTH,
                  overflow: "hidden",
                  transform: [{ translateX }],
                  paddingHorizontal: WEEK_PADDING,
                },
              ]}
            >
              {datesOfWeek(bgWeekDate).map((date) => {
                // 각 날짜별로 스타일 조건을 미리 계산
                const nextDate = date.add(7, "day");

                return (
                  <DayCell
                    key={nextDate.format("YYYY-MM-DD")}
                    date={nextDate.toDate()}
                    selectedDate={selectedDate}
                    disabledTime={disabledTime.toDate()}
                  />
                );
              })}
            </Animated.View>
          </View>

          <Pressable
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 32,
              width: 32,
              zIndex: 100,
            }}
            onPress={() => !isAnimating && nextWeek()}
          >
            <Icons
              size={24}
              name={"chevron-forward"}
              color={Color["blue500"]}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  DayText: {
    width: 28,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey500"],
  },
  Date: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
    borderRadius: 5,
    color: Color["grey500"],
  },
  MonthRow: {
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  MonthNumber: {
    width: 44,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey700"],
  },
  MonthBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
  },
});

const DayCell = React.memo(
  ({
    date,
    selectedDate,
    disabledTime,
    onPress,
  }: {
    date: Date;
    selectedDate: Date;
    disabledTime: Date;
    onPress?: (date: Date) => void;
  }) => {
    // 각 날짜별로 스타일 조건을 미리 계산
    const dayjsDate = dayjs(date);
    const isSelected = dayjs(selectedDate).isSame(dayjsDate, "day");
    const isDisabled = dayjsDate.isBefore(disabledTime);

    return (
      <Pressable
        onPress={() => onPress?.(date)}
        style={[
          {
            width: 28,
            height: 28,
            borderRadius: 5,
            justifyContent: "center",
          },
          isSelected && {
            backgroundColor: Color["blue100"],
          },
        ]}
      >
        <Text
          style={[
            styles.Date,
            isDisabled && {
              color: Color["grey300"],
            },
          ]}
        >
          {dayjsDate.date()}
        </Text>
      </Pressable>
    );
  },
);

DayCell.displayName = "DayCell";
