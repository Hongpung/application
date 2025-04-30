import { useState } from "react";
import { View } from "react-native";
import { ReservationStackScreenProps } from "@hongpung/src/common/navigation";
import { WeekCalendarHeader } from "@hongpung/src/common/ui/WeekCalendarHeader/WeekCalendarHeader";

import { useLoadDailyReservationsFetch } from "@hongpung/src/entities/reservation";
import { ReservationCard } from "@hongpung/src/entities/reservation/ui/ReservationCard/ReservationCard";

import { TimeLine } from "@hongpung/src/widgets/reservation/ui/TimeLine/TimeLine";

const DailyReservationListPage: React.FC<
  ReservationStackScreenProps<"DailyReserveList">
> = ({ navigation, route }) => {
  const { date } = route.params;
  const [selectedDate, selectDate] = useState<Date>(
    date ? new Date(date) : new Date()
  );
  const {
    data: reservations,
    isLoading,
    error,
  } = useLoadDailyReservationsFetch({ date: selectedDate });

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <WeekCalendarHeader
        changeDate={(newDate) => {
          selectDate(newDate);
        }}
        onPressBackButton={() => {
          //이전 화면으로 이동
          if (navigation.canGoBack()) navigation.goBack();
        }}
        selectedDate={selectedDate}
        navigateToCreateReservation={() => {
          navigation.push("CreateReservation", {
            screen: "CreateReservationForm",
            params: { date: selectedDate.toISOString() },
          });
        }}
      />
      <TimeLine>
        {reservations?.map((reservation) => (
          <ReservationCard
            reservation={reservation}
            onPress={() => {
              //예약 화면으로 이동
              navigation.push("Reservation", {
                screen: "ReservationDetail",
                params: {
                  reservationId: reservation.reservationId,
                },
              });
            }}
          />
        ))}
      </TimeLine>
    </View>
  );
};

export default DailyReservationListPage;
