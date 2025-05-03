import { Pressable, View, Text, StyleSheet, Dimensions } from "react-native";
import { Color } from "../../constant/color";
import { Icons } from "../Icons/Icons";
import { useMemo } from "react";
import { useNavigation } from "@react-navigation/native";

type WeekCalendarHeaderProps = {
  selectedDate: Date;
  changeDate: (selectedDate: Date) => void;
  onPressBackButton: () => void;
  isLimit?: boolean;
  RightButton?: React.ReactNode;
};

const { width } = Dimensions.get("window");

export const WeekCalendarHeader: React.FC<WeekCalendarHeaderProps> = ({
  selectedDate,
  changeDate,
  onPressBackButton,
  isLimit = false,
  RightButton,
}) => {
  const navigation = useNavigation();
  const today = new Date();

  const datesOfWeek = useMemo(() => {
    const day = selectedDate.getDay() == 0 ? 7 : selectedDate.getDay();
    const week = [];
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() - day + 1);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      week.push(currentDate);
    }
    return week;
  }, [selectedDate]);

  const incrementMonth = () => {
    if (!selectedDate) return;
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(selectedDate.getMonth() + 1);
    changeDate(nextMonth);
  };

  const decrementMonth = () => {
    if (!selectedDate) return;
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(selectedDate.getMonth() - 1);
    changeDate(prevMonth);
  };

  const prevWeek = () => {
    if (!selectedDate) return;
    const lastDay = new Date(selectedDate);
    lastDay.setDate(selectedDate.getDate() - 7);
    const today = new Date();
    if (lastDay <= today) lastDay.setDate(today.getDate() + 1);
    changeDate(lastDay);
  };

  const nextWeek = () => {
    if (!selectedDate) return;
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 7);
    changeDate(nextDay);
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
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 11,
            left: 22,
            width: 28,
            height: 28,
          }}
        >
          <Icons name="arrow-back" size={24} color={Color["blue500"]} />
        </Pressable>
        <View style={styles.MonthRow}>
          <Pressable style={styles.MonthBtn} onPress={decrementMonth}>
            <Icons size={24} name={"caret-back"} color={Color["grey300"]} />
          </Pressable>
          <Pressable onPress={onPressBackButton}>
            <Text style={styles.MonthNumber}>
              {`${selectedDate.getMonth() + 1}월`}
            </Text>
          </Pressable>

          <Pressable style={styles.MonthBtn} onPress={incrementMonth}>
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
          width: width - 64,
          alignItems: "center",
        }}
      >
        <View style={{ height: 4 }} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: 264,
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
            }}
            onPress={prevWeek}
          >
            <Icons size={24} name={"chevron-back"} color={Color["blue500"]} />
          </Pressable>

          <View
            style={{
              height: 32,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: 264,
              marginHorizontal: 8,
            }}
          >
            {datesOfWeek.map((date) => (
              <Pressable
                key={`${date}`}
                onPress={() => {
                  isLimit
                    ? date > new Date(today.getTime() + 13 * 60 * 60 * 1000) &&
                      changeDate(date)
                    : changeDate(date);
                }}
                style={[
                  {
                    width: 28,
                    height: 28,
                    borderRadius: 5,
                    justifyContent: "center",
                  },
                  selectedDate.getDate() == date.getDate() && {
                    backgroundColor: Color["blue100"],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.Date,
                    date <= new Date(today.getTime() + 13 * 60 * 60 * 1000) && {
                      color: Color["grey300"],
                    },
                  ]}
                >
                  {date.getDate()}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 32,
              width: 32,
            }}
            onPress={nextWeek}
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
