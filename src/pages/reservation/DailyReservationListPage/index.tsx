import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, View, Text, ScrollView } from "react-native";
import { ReservationStackScreenProps } from "@hongpung/src/common/navigation";
import { WeekCalendarHeader } from "@hongpung/src/common/ui/WeekCalendarHeader/WeekCalendarHeader";

import { useLoadDailyReservationsFetch } from "@hongpung/src/entities/reservation";
import { ReservationCard } from "@hongpung/src/entities/reservation/ui/ReservationCard/ReservationCard";

import { TimeLine } from "@hongpung/src/widgets/reservation/ui/TimeLine/TimeLine";
import { Color } from "@hongpung/src/common";
import dayjs from "dayjs";
import { debounce } from "lodash";

const DailyReservationListPage: React.FC<
  ReservationStackScreenProps<"DailyReservationList">
> = ({ navigation, route }) => {
  const { date } = route.params;
  const [selectedDate, selectDate] = useState<Date>(
    date
      ? dayjs(date).hour(0).minute(0).second(0).millisecond(0).toDate()
      : dayjs().hour(0).minute(0).second(0).millisecond(0).toDate(),
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshFlag = useRef(false);

  const {
    data: reservations,
    isLoading,
    refetch: refetchDailyReservations,
  } = useLoadDailyReservationsFetch({ date: selectedDate });

  const isCreatePossible = useMemo(() => {
    const limitTime = dayjs(selectedDate)
      .subtract(1, "day")
      .hour(22)
      .minute(0)
      .second(0);

    return dayjs().isBefore(limitTime);
  }, [selectedDate]);

  const navigateToCreateReservation = useMemo(
    () =>
      debounce(
        () => {
          navigation.push("CreateReservation", {
            screen: "CreateReservationForm",
            params: { date: dayjs(selectedDate).format("YYYY-MM-DD") },
          });
        },
        500,
        {
          leading: true,
          trailing: false,
        },
      ),
    [navigation, selectedDate],
  );

  const handleBackPress = useMemo(
    () =>
      debounce(
        () => {
          if (navigation.canGoBack()) navigation.goBack();
        },
        500,
        {
          leading: true,
          trailing: false,
        },
      ),
    [navigation],
  );

  const handleReservationPress = useMemo(
    () =>
      debounce(
        (reservationId: number) => {
          navigation.push("Reservation", {
            screen: "ReservationDetail",
            params: { reservationId },
          });
        },
        500,
        {
          leading: true,
          trailing: false,
        },
      ),
    [navigation],
  );

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (refreshFlag.current) {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      refreshFlag.current = false;
    }
  }, [selectedDate]);

  useEffect(() => {
    if (refreshFlag.current) {
      setIsRefreshing(isLoading);
    } else {
      refreshFlag.current = true;
    }
  }, [isLoading]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <WeekCalendarHeader
        changeDate={selectDate}
        onPressBackButton={handleBackPress}
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
      <TimeLine
        ref={scrollRef}
        refreshing={isRefreshing}
        isLoading={isLoading}
        onRefresh={refetchDailyReservations}
      >
        {reservations?.map((reservation, index) => (
          <ReservationCard
            key={reservation.reservationId + "rCard" + index}
            reservation={reservation}
            onPress={() => handleReservationPress(reservation.reservationId)}
          />
        ))}
      </TimeLine>
    </View>
  );
};

export default DailyReservationListPage;
