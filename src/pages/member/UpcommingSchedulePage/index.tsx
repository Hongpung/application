import { StyleSheet, View } from "react-native";
import React, { useCallback } from "react";
import MyScheduleList from "@hongpung/src/features/member/loadMyUpcommingSchedule/ui/MyScheduleList/MyScheduleList";
import { useLoadMyUpcommingSchedule } from "@hongpung/src/features/member/loadMyUpcommingSchedule/model/useLoadMyUpcommingSchedule";

const UpcommingSchedulePage: React.FC<MainStackProps<"MyPage">> = ({
  navigation,
}) => {
  const { reservationList, isLoading, loadMore } = useLoadMyUpcommingSchedule();

  const onPressReservationTicek = useCallback((reservationId: number) => {
    navigation.navigate("Reservation", {
      screen: "ReservationDetail",
      params: { reservationId },
    });
  }, [navigation]);

  const navigateToReservation = useCallback(() => {
    navigation.navigate("Reservation");
  }, [navigation]);

  if (isLoading) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
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
