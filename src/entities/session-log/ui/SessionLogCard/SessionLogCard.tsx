import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Color, Icons } from "@hongpung/src/common";
import { SessionLog } from "../../model/type";

export interface SessionLogCardProps {
  session: SessionLog;
  onPress?: (sessionId: number) => void;
}

export const SessionLogCard: React.FC<SessionLogCardProps> = ({
  session,
  onPress = (sessionId: number) => {},
}) => {
  const isRegularType =
    session.sessionType === "RESERVED" &&
    "reservationType" in session &&
    session.reservationType === "REGULAR";

  // 정기연습은 파란색 테두리, 일반연습은 빨간색 테두리로 표시
  const borderColor = isRegularType
    ? Color["blue400"]
    : session.participationAvailable
      ? Color["green400"]
      : Color["red400"];

  // 참가자 수 계산
  const participantCount = session.participators?.length || 0;

  return (
    <Pressable
      onPress={() => onPress(session.sessionId)}
      style={[styles.container, { borderColor }]}
    >
      {/* 정기연습인 경우 상단에 북마크 표시 */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {session.title}
          </Text>
          <Text style={styles.duration}>
            {session.startTime}~{session.endTime}
          </Text>
        </View>
        {isRegularType ? (
          <View style={styles.bookmark}>
            <Icons name={"bookmark-sharp"} color={Color["blue400"]} size={36} />
          </View>
        ) : (
          <View style={styles.creatorInfo}>
            <Text style={styles.creatorName}>{session.creatorName}</Text>
            {session.creatorNickname && (
              <Text style={styles.creatorNickname}>
                {session.creatorNickname}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* 일반연습인 경우 참가자 정보 표시 */}

      <View style={styles.footer}>
        <View style={styles.content}>
          <View style={styles.participantContainer}>
            <Icons name="people" color={Color["grey300"]} size={24} />
            <Text style={styles.participantCount}>{participantCount + 1}</Text>
          </View>
        </View>
        <Text style={styles.usingTypeInfo}>
          {session.sessionType === "REALTIME"
            ? "실시간 연습"
            : isRegularType
              ? "정규 일정"
              : "개인 일정"}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    position: "relative",
    minHeight: 120,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  bookmark: {
    alignItems: "flex-end",
    flexShrink: 0,
    top: -20,
  },
  creatorInfo: {
    gap: 2,
    flexShrink: 0,
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  header: {
    position: "relative",
    flexGrow: 1,
    flexShrink: 1,
    gap: 4,
  },
  title: {
    width: "100%",
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
  },
  duration: {
    fontSize: 14,
    fontFamily: "NanumSquareNeo-Light",
    color: Color["grey400"],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  participantCount: {
    fontSize: 14,
    color: Color["grey400"],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
  },
  usingTypeInfo: {
    fontSize: 12,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey300"],
  },
  date: {
    fontSize: 14,
    fontFamily: "NanumSquareNeo-Light",
    color: Color["grey300"],
  },
  creatorName: {
    fontSize: 14,

    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey500"],
  },
  creatorNickname: {
    fontSize: 13,

    fontFamily: "NanumSquareNeo-Light",
    color: Color["grey400"],
  },
});
