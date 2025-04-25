import React from "react";
import { StyleSheet, View } from "react-native";

import ReservationTypeTable from "@hongpung/src/entities/reservation/ui/ReservationTypeTable";

import { FullCalendar } from "@hongpung/src/widgets/reservation/ui/FullCalendar/FullCalendar";
import { useReservationCalendar } from "@hongpung/src/features/reservation/configureReservation/model/useReservationCalendar";
import { ReservationStackScreenProps } from "@hongpung/src/navigation/ReservationNavigation";
import { Header } from "@hongpung/src/common";

const ReservationCalendarPage: React.FC<
  ReservationStackScreenProps<"ReservationCalendar">
> = ({ navigation }) => {
  const calendarform = useReservationCalendar();

  return (
    <View style={styles.container}>
      <Header leftButton={"close"} headerName={"예약 일정"} />
      <View style={styles.typeTable}>
        <ReservationTypeTable />
      </View>
      <View style={styles.calendarContainer}>
        <FullCalendar
          onClickDate={(date) => {
            const dateString = date.toISOString().split("T")[0];
            navigation.push("DailyReserveList", { date: dateString });
          }}
          {...calendarform}
        />
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
