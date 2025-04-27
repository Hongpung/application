import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import ScheduleCardList from "@hongpung/src/widgets/session/ui/ScheduleCardList/ScheduleCardList";
import { useScheduleCardList } from "@hongpung/src/features/session/loadSessionScheduleList/model/useScheduleCardList";
import ScheduleStatusBar from "@hongpung/src/widgets/session/ui/ScheduleStatusBar/ScheduleStatusBar";
import { useSessionListSocket } from "@hongpung/src/features/session/loadSessionScheduleList/socket/useSessionListSocket";
import { NavigateCalendarButton } from "@hongpung/src/common";
import { MainTabScreenProps } from "@hongpung/src/navigation/MainTabNavigation";

const { height } = Dimensions.get("window");

const ReservationMainScreen: React.FC<MainTabScreenProps<"Reservation">> = ({
  navigation,
}) => {
  const { sessionList } = useSessionListSocket();
  const { cardViewRef, isOnAir, isParticipatible, scheduleCardList } =
    useScheduleCardList(sessionList);

  console.log(sessionList);

  return (
    <View style={styles.container}>
      <View style={{ gap: 24 }}>
        <ScheduleStatusBar
          isOnAir={isOnAir}
          isParticipatible={isParticipatible}
        />
        <ScheduleCardList
          ref={cardViewRef}
          isOnAir={isOnAir}
          scheduleCards={scheduleCardList}
          navigateToDetail={(reservationId) =>
            navigation.push("Reservation", {
              screen: "ReservationDetail",
              params: { reservationId },
            })
          }
          navigateToQRScan={() => navigation.jumpTo("QRCode")}
        />
      </View>
      <NavigateCalendarButton
        navigateReservationCalendar={() =>
          navigation.push("Reservation", { screen: "ReservationCalendar" })
        }
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
