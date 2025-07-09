import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";

import {
  Reservation,
  ReservationTicket,
} from "@hongpung/src/entities/reservation";
import { getDisplayDate } from "@hongpung/src/features/member/loadMyUpcommingSchedule/lib/getDisplayData";
import EmptySchedule from "@hongpung/src/widgets/member/ui/EmptySchedule/EmptySchedule";

interface MyScheduleListProps {
  groupedReservations: [string, Reservation[]][];
  onPressReservationTicek: (reservationId: number) => void;
  navigateToReservation: () => void;
  onEndReached: () => void;
  isLoading: boolean;
}

const MyScheduleList: React.FC<MyScheduleListProps> = ({
  groupedReservations,
  onPressReservationTicek: onReservationPress,
  navigateToReservation,
  onEndReached,
}) => {
  const keyExtractor = (item: [string, Reservation[]]) => item[0];
  console.log(groupedReservations);

  const renderItem = ({
    item: [date, reservations],
  }: {
    item: [string, Reservation[]];
  }) => {
    const { string: dateString, style } = getDisplayDate(date);

    return (
      <View>
        <Text style={[styles.dateText, style]}>{dateString}</Text>
        {reservations.map((reservation) => (
          <ReservationTicket
            key={reservation.reservationId}
            reservation={reservation}
            onPressTicket={(reservationId) => onReservationPress(reservationId)}
          />
        ))}
      </View>
    );
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={groupedReservations}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <EmptySchedule navigateToReservation={navigateToReservation} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  dateText: {
    marginVertical: 8,
    marginHorizontal: 4,
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 16,
  },
});

export default MyScheduleList;
