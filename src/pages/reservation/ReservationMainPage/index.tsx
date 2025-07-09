import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";

import {
  defaultSkeletonConfig,
  NavigateCalendarButton,
} from "@hongpung/src/common";
import { MainTabScreenProps } from "@hongpung/src/common/navigation";
import { debounce } from "lodash";

import {
  useScheduleCardList,
  useSessionListSocket,
} from "@hongpung/src/features/session/loadSessionScheduleList";
import {
  ScheduleCardList,
  ScheduleStatusBar,
} from "@hongpung/src/widgets/session";
import { Skeleton } from "moti/skeleton";

const { height } = Dimensions.get("window");

const ReservationMainScreen: React.FC<MainTabScreenProps<"Reservation">> = ({
  navigation,
}) => {
  const { sessionList } = useSessionListSocket();
  const {
    cardViewRef,
    isOnAir,
    isParticipatible,
    scheduleCardList,
    isLoading,
  } = useScheduleCardList(sessionList);

  const navigateToDetail = debounce(
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
  );

  const navigateToQRScan = () => {
    navigation.jumpTo("QRCode");
  };

  const navigateReservationCalendar = debounce(
    () => {
      navigation.push("Reservation", { screen: "ReservationCalendar" });
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );

  return (
    <View style={styles.container}>
      <View style={{ gap: 24 }}>
        <ScheduleStatusBar
          isOnAir={isOnAir}
          isParticipatible={isParticipatible}
        />
        {isLoading ? (
          <Skeleton
            {...defaultSkeletonConfig}
            width={100}
            height={28}
            radius={4}
          />
        ) : (
          <ScheduleCardList
            ref={cardViewRef}
            isOnAir={isOnAir}
            scheduleCards={scheduleCardList}
            navigateToDetail={navigateToDetail}
            navigateToQRScan={navigateToQRScan}
          />
        )}
      </View>
      <NavigateCalendarButton
        navigateReservationCalendar={navigateReservationCalendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
    flexDirection: "column",
    paddingTop: height / 4,
  },
});

export default ReservationMainScreen;
