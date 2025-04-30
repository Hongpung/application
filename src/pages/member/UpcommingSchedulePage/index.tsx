import { StyleSheet, View } from "react-native";
import React, { useCallback } from "react";
import MyScheduleList from "@hongpung/src/features/member/loadMyUpcommingSchedule/ui/MyScheduleList/MyScheduleList";
import { useLoadMyUpcommingSchedule } from "@hongpung/src/features/member/loadMyUpcommingSchedule/model/useLoadMyUpcommingSchedule";
import { MainStackScreenProps } from "@hongpung/src/common/navigation";
import { Header } from "@hongpung/src/common";

const UpcommingSchedulePage: React.FC<MainStackScreenProps<"UpComingReservation">> = ({
  navigation,
}) => {
  const { reservationList, isLoading, loadMore } = useLoadMyUpcommingSchedule();

  const onPressReservationTicek = useCallback((reservationId: number) => {
    navigation.navigate("Reservation", {
      screen: "ReservationDetail",
      params: { reservationId },
    });
  }, []);

  const navigateToReservation = useCallback(() => {
    navigation.navigate("Reservation",{screen:"ReservationCalendar"});
  }, []);

  if (isLoading) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Header headerName="다가오는 일정" leftButton={"arrow-back"} />
      <MyScheduleList
        groupedReservations={reservationList}
        onPressReservationTicek={onPressReservationTicek}
        onEndReached={loadMore}
        isLoading={isLoading}
        navigateToReservation={navigateToReservation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

export default UpcommingSchedulePage;
