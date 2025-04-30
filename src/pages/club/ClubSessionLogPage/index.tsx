import React from "react";
import { View, StyleSheet } from "react-native";

import { Header } from "@hongpung/src/common";
import MiniCalendar from "@hongpung/src/common/ui/MiniCalendar";
import { useMiniCalendar } from "@hongpung/src/common/lib/useMiniCalendar";

import {
  useSessionColor,
  useLoadClubSessionLogFetch,
} from "@hongpung/src/entities/session";

import { useSessionLogList } from "@hongpung/src/features/session/viewMySessionLog/model/useSessionLogList";
import { SessionLogList } from "@hongpung/src/widgets/session/ui/SessionLogList/SessionLogList";
import { ClubStackProps } from "@hongpung/src/common/navigation";

const ClubSessionLogPage: React.FC<ClubStackProps<"ClubLogs">> = ({
  navigation,
}) => {
  const { currentMonth, selectedDate, handleDateSelect, handleMonthChange } =
    useMiniCalendar();
  const { data: sessionLogList, isLoading } = useLoadClubSessionLogFetch({
    calendarMonth: currentMonth,
  });
  const dailySessionColors = useSessionColor({ sessionLogList });
  const { matchedSessionList } = useSessionLogList(
    sessionLogList,
    selectedDate
  );

  const handleSessionPress = (sessionId: number) => {
    // navigation.push("SessionLogDetail", { sessionId });
  };

  return (
    <View style={styles.container}>
      <Header headerName="동아리 연습 내역" leftButton={"arrow-back"} />
      <MiniCalendar
        dateItems={dailySessionColors}
        selectedDate={selectedDate}
        currentMonth={currentMonth}
        onDateSelect={handleDateSelect}
        onMonthChange={handleMonthChange}
      />
      <SessionLogList
        sessions={matchedSessionList}
        onSessionPress={(sessionId) => handleSessionPress(sessionId)}
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

export default ClubSessionLogPage;
