import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, View, Text, ScrollView } from "react-native";
import { ReservationStackScreenProps } from "@hongpung/src/common/navigation";
import { WeekCalendarHeader } from "@hongpung/src/common/ui/WeekCalendarHeader/WeekCalendarHeader";

import { useLoadDailyReservationsFetch } from "@hongpung/src/entities/reservation";
import { ReservationCard } from "@hongpung/src/entities/reservation/ui/ReservationCard/ReservationCard";

import { TimeLine } from "@hongpung/src/widgets/reservation/ui/TimeLine/TimeLine";
import { Color, FullScreenLoadingModal } from "@hongpung/src/common";

const DailyReservationListPage: React.FC<
  ReservationStackScreenProps<"DailyReserveList">
> = ({ navigation, route }) => {
  const { date } = route.params;
  const [selectedDate, selectDate] = useState<Date>(
    date ? new Date(date) : new Date()
  );
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [selectedDate]);

  const {
    data: reservations,
    isLoading,
    error,
  } = useLoadDailyReservationsFetch({ date: selectedDate });

  const isCreatePossible = useMemo(() => {
    const today = new Date();
    return selectedDate.getTime() + 4 * 60 * 60 * 1000 >= today.getTime();
  }, [selectedDate]);

  const navigateToCreateReservation = useCallback(() => {
    navigation.push("CreateReservation", {
      screen: "CreateReservationForm",
      params: { date: selectedDate.toISOString() },
    });
  }, [navigation, selectedDate]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <FullScreenLoadingModal isLoading={isLoading} />
      <WeekCalendarHeader
        changeDate={(newDate) => {
          selectDate(newDate);
        }}
        onPressBackButton={() => {
          if (navigation.canGoBack()) navigation.goBack();
        }}
        selectedDate={selectedDate}
        RightButton={
          isCreatePossible && (
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
          )
        }
      />
      <TimeLine ref={scrollRef}>
        {reservations?.map((reservation, index) => (
          <ReservationCard
            key={reservation.reservationId + "rCard" + index}
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
