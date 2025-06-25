import { View, Text, Pressable, StyleSheet } from "react-native";

import {
  Alert,
  Color,
  defaultSkeletonConfig,
  DeferredComponent,
  Icons,
} from "@hongpung/src/common";
import { useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Skeleton } from "moti/skeleton";
import { WeekRow } from "./WeekRow";

type FullCalendarProps = {
  onClickDate: (date: Date) => void;
  calendarMonth: Date;
  datesInMonth: number[][];
  incrementMonth: () => void;
  decrementMonth: () => void;

  error: Error | null;
  selectedDate: Date | null;
  reservationsData?: {
    [key: number]: {
      color: string;
    }[];
  };
  isLoading: boolean;
};

export const FullCalendar: React.FC<FullCalendarProps> = (props) => {
  const {
    calendarMonth,
    datesInMonth,
    incrementMonth,
    decrementMonth,
    onClickDate,
    reservationsData,
    error,
    isLoading,
    selectedDate,
  } = props;

  const navigation = useNavigation();

  const onError = useCallback((error: Error) => {
    console.error("오류 발생:", error);
    Alert.alert("오류", error.message || "알 수 없는 오류입니다.");
  }, []);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  if (error) {
    navigation.goBack();
    return (
      <View>
        <Text>오류</Text>
      </View>
    );
  }

  return (
    <View>
      <Text
        style={{
          textAlign: "center",
          fontSize: 16,
          fontFamily: "NanumSquareNeo-Regular",
          color: Color["grey400"],
        }}
      >{`${calendarMonth.getFullYear()}년`}</Text>
      <View style={{ height: 8 }} />
      <View style={styles.MonthRow}>
        <Pressable style={styles.MonthBtn} onPress={decrementMonth}>
          <Icons size={24} name={"chevron-back"} color={Color["blue500"]} />
        </Pressable>

        <Text style={styles.MonthNumber}>
          {`${calendarMonth.getMonth() + 1}월`}
        </Text>

        <Pressable style={styles.MonthBtn} onPress={incrementMonth}>
          <Icons size={24} name={"chevron-forward"} color={Color["blue500"]} />
        </Pressable>
      </View>

      <View style={{ height: 32 }} />
      <View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 32,
            justifyContent: "space-around",
          }}
        >
          <Text key={"mon"} style={styles.DayText}>
            월
          </Text>
          <Text key={"tue"} style={styles.DayText}>
            화
          </Text>
          <Text key={"wed"} style={styles.DayText}>
            수
          </Text>
          <Text key={"thu"} style={styles.DayText}>
            목
          </Text>
          <Text key={"fri"} style={styles.DayText}>
            금
          </Text>
          <Text key={"sat"} style={styles.DayText}>
            토
          </Text>
          <Text key={"sun"} style={styles.DayText}>
            일
          </Text>
        </View>
        <View style={{ height: 20 }} />
        {isLoading || !reservationsData ? (
          <DeferredComponent delay={100}>
            <View
              style={{
                height: 300,
                width: "100%",
                paddingHorizontal: 32,
                borderRadius: 24,
                overflow: "hidden",
              }}
            >
              <Skeleton
                {...defaultSkeletonConfig}
                height={300}
                width={"100%"}
              />
            </View>
          </DeferredComponent>
        ) : (
          <View
            style={{
              gap: 4,
            }}
          >
            {datesInMonth.map((week, index) => (
              <WeekRow
                key={`week-${index}`}
                week={week}
                weekIndex={index}
                calendarMonth={calendarMonth}
                reservationsData={reservationsData}
                onDatePress={onClickDate}
                selectedDate={selectedDate}
              />
            ))}
          </View>
        )}
        <View style={{ height: 8 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  MonthRow: {
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  MonthNumber: {
    width: 56,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey700"],
  },
  MonthBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
  },
  DayText: {
    width: 28,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey500"],
  },
  CalendarText: {
    width: 28,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
    marginVertical: 2,
  },
});
