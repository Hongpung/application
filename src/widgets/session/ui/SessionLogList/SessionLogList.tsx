import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { SessionLog } from "@hongpung/src/entities/session";
import { SessionLogCard } from "@hongpung/src/entities/session/ui/SessionLogCard/SessionLogCard";
import { daysOfWeek } from "@hongpung/src/common/constant/dayOfWeek";
import { Color } from "@hongpung/src/common";

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
      style={{ flex: 1 }}
      data={sessions}
      renderItem={renderItem}
      keyExtractor={(item) => item[0]}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "NanumSquareNeo-Regular",
              color: Color["grey400"],
              paddingBottom: "60%",
            }}
          >
            연습 내역이 없어요.
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
});
