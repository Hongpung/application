import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

import dayjs from "dayjs";

import { Color, getDateString } from "@hongpung/src/common";
import { SessionLog } from "../../model/type";
import { timeToDate } from "@hongpung/src/entities/session/lib/timeToDate";

interface SessionInfoSummaryProps {
  sessionData: SessionLog;
  animatedStyle?: any;
}

export const SessionInfoSummary: React.FC<SessionInfoSummaryProps> = ({
  sessionData,
  animatedStyle,
}) => {
  const calculateDuration = () => {
    const diffMinutes = dayjs(timeToDate(sessionData.endTime)).diff(
      dayjs(timeToDate(sessionData.startTime)),
      "minutes",
    );
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return {
      hours: hours > 0 ? hours : 0,
      minutes: minutes > 0 ? minutes : 0,
    };
  };

  const { hours, minutes } = calculateDuration();

  const getSessionTypeDisplay = () => {
    if (
      sessionData.sessionType === "RESERVED" &&
      "reservationType" in sessionData
    ) {
      return sessionData.reservationType === "REGULAR"
        ? "정규 일정"
        : sessionData.participationAvailable
          ? "열린 연습"
          : "개인 연습";
    }
    return "개인 연습";
  };

  const getSessionSubType = () => {
    return sessionData.sessionType === "REALTIME" ? "실시간 연습" : "예약 연습";
  };

  return (
    <>
      <Animated.View style={[animatedStyle, styles.titleContainer]}>
        <Text style={styles.date}>{getDateString(sessionData.date)}</Text>
        <Text style={styles.title}>{sessionData.title}</Text>
      </Animated.View>

      <Animated.View style={[animatedStyle, styles.summaryBlock]}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>이용 시간</Text>
          <View style={styles.summaryContentContainer}>
            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "flex-end" }}
            >
              <Text style={styles.summaryContent}>
                {hours > 0 ? `${hours}시간 ` : ""}
                {minutes}분
              </Text>
              {sessionData.forceEnd && (
                <Text
                  style={{
                    color: Color["red500"],
                    paddingVertical: 4,
                    paddingHorizontal: 6,
                    borderRadius: 8,
                    backgroundColor: Color["red100"],
                    fontSize: 12,
                    fontFamily: "NanumSquareNeo-Bold",
                    textAlignVertical: "center",
                  }}
                >
                  강제 종료
                </Text>
              )}
            </View>
            <Text style={styles.summarySubContent}>
              {`(${dayjs(timeToDate(sessionData.startTime)).format(
                "HH:mm",
              )}~${dayjs(timeToDate(sessionData.endTime)).format("HH:mm")})`}
            </Text>
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>연습 유형</Text>
          <View style={styles.summaryContentContainer}>
            <Text style={styles.summaryContent}>{getSessionTypeDisplay()}</Text>
            <Text style={styles.summarySubContent}>{getSessionSubType()}</Text>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    paddingTop: 12,
    flexDirection: "column",
    gap: 8,
    paddingHorizontal: 28,
  },
  date: {
    fontSize: 14,
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey300"],
  },
  title: {
    fontSize: 21,
    fontFamily: "NanumSquareNeo-ExtraBold",
  },
  summaryBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 28,
  },
  summaryContainer: {
    flexGrow: 1,
    flexDirection: "column",
    gap: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey400"],
  },
  summaryContentContainer: {
    flexDirection: "column",
    paddingHorizontal: 2,
    gap: 8,
  },
  summaryContent: {
    fontSize: 21,
    fontFamily: "NanumSquareNeo-ExtraBold",
    color: Color["grey800"],
  },
  summarySubContent: {
    fontSize: 14,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey300"],
  },
});
