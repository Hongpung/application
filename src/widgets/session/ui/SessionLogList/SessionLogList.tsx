import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { SessionLog } from "@hongpung/src/entities/session";
import { SessionLogCard } from "@hongpung/src/entities/session/ui/SessionLogCard/SessionLogCard";
import { daysOfWeek } from "@hongpung/src/common/constant/dayOfWeek";

interface SessionLogListProps {
  sessions: [string, SessionLog[]][];
  onSessionPress: (sessionId: number) => void;
}

export const SessionLogList: React.FC<SessionLogListProps> = ({
  sessions,
  onSessionPress,
}) => {
  const renderItem = ({
    item: [dateString, sessionList],
  }: {
    item: [string, SessionLog[]];
  }) => {
    const date = new Date(dateString);
    return (
      <View>
        <Text>
          {date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}(
          {daysOfWeek[date.getDay()]})
        </Text>
        {sessionList.map((session) => (
          <SessionLogCard
            key={session.sessionId}
            session={session}
            onPress={() => onSessionPress(session.sessionId)}
          />
        ))}
      </View>
    );
  };

  return (
    <FlatList
      data={sessions}
      renderItem={renderItem}
      keyExtractor={(item) => item[0]}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
