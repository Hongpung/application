import React from "react";
import { View, StyleSheet } from "react-native";

import {Header} from "@hongpung/src/common";
import MiniCalendar from "@hongpung/src/common/ui/MiniCalendar";
import { useMiniCalendar } from "@hongpung/src/common/lib/useMiniCalendar";

import { useSessionColor } from "@hongpung/src/entities/session";

import { useSessionLogList } from "@hongpung/src/features/session/viewMySessionLog/model/useSessionLogList";
import { useLoadMySessionLogFetch } from "@hongpung/src/features/session/viewMySessionLog/api/mySessionLogApi";
import { SessionLogList } from "@hongpung/src/widgets/session/ui/SessionLogList/SessionLogList";
import { MainStackScreenProps } from "@hongpung/src/navigation/MainStackNavigation";

const MySessionLogPage: React.FC<MainStackScreenProps<"MyLog">> = ({
  navigation,
}) => {
  const { currentMonth, selectedDate, handleDateSelect, handleMonthChange } =
    useMiniCalendar();
  const { data: sessionLogList, isLoading } = useLoadMySessionLogFetch({
    calendarMonth: currentMonth,
  });
  const dailySessionColors = useSessionColor({ sessionLogList });
  const { matchedSessionList } = useSessionLogList(
    sessionLogList,
    selectedDate
  );

  const handleSessionPress = (sessionId: number) => {
    // navigation.push("MyPracticeInfo", { sessionId });
  };

  return (
    <View style={styles.container}>
      <Header headerName="내 연습 내역" leftButton={"arrow-back"} />
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

export default MySessionLogPage;
