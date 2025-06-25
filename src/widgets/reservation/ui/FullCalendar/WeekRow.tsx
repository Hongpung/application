import { Color } from "@hongpung/src/common";
import dayjs from "dayjs";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface WeekRowProps {
  week: number[];
  weekIndex: number;
  calendarMonth: Date;
  selectedDate: Date | null;
  reservationsData: {
    [key: number]: {
      color: string;
    }[];
  } | null;
  onDatePress: (date: Date) => void;
}

export const WeekRow: React.FC<WeekRowProps> = ({
  week,
  weekIndex,
  reservationsData,
  calendarMonth,
  selectedDate,
  onDatePress,
}) => {
  // 오늘 날짜 관련 계산 (useMemo 제거하고 매번 계산 - 성능 차이 미미하고 더 안전)
  const now = dayjs();
  const today = now.startOf("day").toDate();

  // 오늘 날짜인지 확인하는 함수
  const isToday = (date: Date) => {
    return dayjs(date).isSame(today, "day");
  };

  return (
    <View
      key={"week-" + weekIndex}
      style={{
        flexDirection: "row",
        marginHorizontal: 32,
        justifyContent: "space-around",
      }}
    >
      {week.map((day, index) => {
        if (day === 0)
          return (
            <View key={"empty" + index} style={{ width: 32, height: 32 }} />
          );
        else {
          const thisDate = dayjs(calendarMonth)
            .date(day)
            .startOf("day")
            .toDate();

          const textColor =
            thisDate < today ? Color["grey300"] : Color["grey400"];
          const isCurrentDay = isToday(thisDate);

          return (
            <Pressable
              key={`date-${day}`}
              style={{
                height: 60,
                width: 32,
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: isCurrentDay
                  ? Color["blue100"]
                  : "transparent",
                borderRadius: 5,
              }}
              onPress={() =>
                onDatePress(dayjs(calendarMonth).date(day).toDate())
              }
            >
              <Text
                style={[
                  styles.CalendarText,
                  {
                    color: isCurrentDay ? Color["blue600"] : textColor,
                  },
                ]}
              >
                {day}
              </Text>
              <View
                style={{
                  marginHorizontal: 2,
                  height: 16,
                  flexDirection: "column-reverse",
                  marginTop: 4,
                }}
              >
                {reservationsData?.[day] &&
                  reservationsData[day].slice(0, 3).map((obj, index) => {
                    const color =
                      obj.color === "grey"
                        ? obj.color + "300"
                        : obj.color + "500";

                    return (
                      <View
                        key={calendarMonth.getMonth() + day + index}
                        style={{
                          height: 4,
                          backgroundColor: Color[color],
                          width: 28,
                          borderRadius: 5,
                          marginTop: 2,
                        }}
                      />
                    );
                  })}
              </View>
              {reservationsData?.[day]?.length &&
                reservationsData[day].length > 3 && (
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "NanumSquareNeo-Bold",
                      color: Color["grey300"],
                      marginTop: 2,
                    }}
                  >
                    +{reservationsData[day].length - 3}
                  </Text>
                )}
            </Pressable>
          );
        }
      })}
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
