import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Color, Icons } from "@hongpung/src/common";
import { Session } from "@hongpung/src/entities/session";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { UserStatusState } from "@hongpung/src/entities/member";
import { useAtomValue } from "jotai";

interface OwnedSessionCardProps {
  session: Session;
}

export const OwnedSessionCard: React.FC<OwnedSessionCardProps> = ({
  session,
}) => {
  const loginUser = useAtomValue(UserStatusState);
  const isOwned = session.creatorId === loginUser?.memberId;

  return (
    <View style={styles.card}>
      <Svg
        height="420"
        width="400"
        style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}
      >
        <Defs>
          <RadialGradient
            id="grad"
            cx="30%"
            cy="56%"
            rx="34%"
            ry="32%"
            fx="32%"
            fy="58%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop
              offset="0%"
              stopColor={isOwned ? Color.blue500 : Color.green500}
            />
            <Stop
              offset="60%"
              stopColor={isOwned ? Color.blue300 : Color.green300}
            />
            <Stop offset="100%" stopColor="#FFFFFF" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>

      <View style={styles.header}>
        <Text
          style={[
            styles.roleText,
            { color: isOwned ? Color.blue500 : Color.green500 },
          ]}
        >
          {isOwned ? "내가 만든 일정" : "참가하는 일정"}
        </Text>
        <Text style={styles.separator}>|</Text>
        <Text style={styles.date}>{session.date}</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {session.title}
        </Text>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.time}>
          {session.startTime}~{session.endTime}
        </Text>
      </View>

      <View style={styles.footer}>
        {session.sessionType === "RESERVED" ? (
          <>
            <Icons name="people" color={Color.grey400} size={24} />
            <Text style={styles.participantCount}>
              {session.participatorIds?.length}
            </Text>
          </>
        ) : (
          <Text style={styles.realtimeText}>실시간 예약</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 320,
    height: 180,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Color.grey100,
    marginVertical: 24,
    overflow: "hidden",
    alignSelf: "center",
  },
  header: {
    position: "absolute",
    flexDirection: "row",
    left: 18,
    top: 18,
    alignItems: "center",
  },
  roleText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 14,
  },
  separator: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 14,
    color: Color.grey800,
    marginHorizontal: 8,
  },
  date: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
    color: Color.grey400,
  },
  titleContainer: {
    position: "absolute",
    width: 208,
    top: 62,
    left: 56,
  },
  title: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 18,
    textAlign: "center",
  },
  timeContainer: {
    position: "absolute",
    right: 20,
    bottom: 50,
    flexDirection: "row",
  },
  time: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
    color: Color.grey400,
  },
  footer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    height: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  participantCount: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
    marginLeft: 4,
    color: Color.grey400,
  },
  realtimeText: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
    color: Color.grey400,
  },
});
