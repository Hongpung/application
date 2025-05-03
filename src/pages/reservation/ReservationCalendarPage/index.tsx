import React, { useCallback } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";

import ReservationTypeTable from "@hongpung/src/entities/reservation/ui/ReservationTypeTable";

import { FullCalendar } from "@hongpung/src/widgets/reservation/ui/FullCalendar/FullCalendar";
import { useReservationCalendar } from "@hongpung/src/features/reservation/configureReservation/model/useReservationCalendar";
import { ReservationStackScreenProps } from "@hongpung/src/common/navigation";
import { Color, Header } from "@hongpung/src/common";

const ReservationCalendarPage: React.FC<
  ReservationStackScreenProps<"ReservationCalendar">
> = ({ navigation }) => {
  const calendarform = useReservationCalendar();

  const navigateToCreateReservation = useCallback(() => {
    navigation.push("Reservation", {
      screen: "CreateReservation",
      params: {
        screen: "CreateReservationForm",
        params: undefined,
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Header
        leftButton={"close"}
        headerName={"예약 일정"}
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
