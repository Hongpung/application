import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Color } from "@hongpung/src/common";
import { SessionLog } from "@hongpung/src/entities/session";

export interface SessionLogCardProps {
  session: SessionLog;
  onPress: () => void;
}

export const SessionLogCard: React.FC<SessionLogCardProps> = ({
  session,
  onPress,
}) => {
  

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{session.date}</Text>
        <Text style={styles.duration}>{session.startTime}~{session.endTime}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.description}>{}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.status}>{session.sessionType}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: Color.gray600,
  },
  duration: {
    fontSize: 14,
    color: Color.gray600,
  },
  content: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Color.gray900,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Color.gray700,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  status: {
    fontSize: 14,
    color: Color.primary,
  },
});
