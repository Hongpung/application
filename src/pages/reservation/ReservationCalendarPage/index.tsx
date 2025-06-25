import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";

import ReservationTypeTable from "@hongpung/src/entities/reservation/ui/ReservationTypeTable";

import { FullCalendar } from "@hongpung/src/widgets/reservation/ui/FullCalendar/FullCalendar";
import { useReservationCalendar } from "@hongpung/src/features/reservation/configureReservation/model/useReservationCalendar";
import { ReservationStackScreenProps } from "@hongpung/src/common/navigation";
import { Color, Header } from "@hongpung/src/common";
import dayjs from "dayjs";
import { debounce } from "lodash";

const ReservationCalendarPage: React.FC<
  ReservationStackScreenProps<"ReservationCalendar">
> = ({ navigation }) => {
  const { setSelectedDate, ...calendar } = useReservationCalendar();

  const navigateToCreateReservation = debounce(
    () => {
      navigation.push("CreateReservation", {
        screen: "CreateReservationForm",
      });
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );

  const handleClickDate = debounce(
    (date: Date) => {
      setSelectedDate(date);
      const dateString = dayjs(date).format("YYYY-MM-DD");
      navigation.push("DailyReservationList", { date: dateString });
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );

  return (
    <View style={styles.container}>
      <Header
        LeftButton={"close"}
        headerName={"연습실 예약 조회"}
        RightButton={
          <Pressable
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={navigateToCreateReservation}
          >
            <Text
              style={{
                color: Color["blue500"],
                fontSize: 16,
                fontFamily: "NanumSquareNeo-Bold",
              }}
            >
              추가
            </Text>
          </Pressable>
        }
      />
      <View style={styles.typeTable}>
        <ReservationTypeTable />
      </View>
      <View style={styles.calendarContainer}>
        <FullCalendar onClickDate={handleClickDate} {...calendar} />
      </View>
    </View>
  );
};

export default ReservationCalendarPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  typeTable: {
    position: "absolute",
    right: 32,
    top: 56,
  },
  calendarContainer: {
    marginTop: 88,
    flex: 1,
  },
});
