import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Color } from "@hongpung/src/common";
import { Member } from "@hongpung/src/entities/member";

interface AttendanceSummaryProps {
  attendanceList: Record<string, Member[]>;
  animatedStyle?: any;
  onViewAll?: () => void;
  sessionType: SessionType;
}

export const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({
  attendanceList,
  animatedStyle,
  onViewAll,
  sessionType,
}) => {
  const getAttendanceCount = (status: AttendanceStatus) => {
    return attendanceList[status] ? attendanceList[status].length : 0;
  };

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>
          {sessionType === "RESERVED" ? "출석 확인" : "참가 확인"}
        </Text>
        {onViewAll && (
          <Text style={styles.viewAllText} onPress={onViewAll}>
            {"전체 보기 >"}
          </Text>
        )}
      </View>

      <View style={styles.spacer} />

      {sessionType === "RESERVED" ? (
        <View style={styles.attendanceContainer}>
          <AttendanceItem
            label="출석"
            count={getAttendanceCount("출석")}
            color={Color["blue500"]}
          />
          <AttendanceItem
            label="지각"
            count={getAttendanceCount("지각")}
            color={Color["red500"]}
          />
          <AttendanceItem
            label="결석"
            count={getAttendanceCount("결석")}
            color={Color["grey400"]}
          />
        </View>
      ) : (
        <View style={styles.attendanceContainer}>
          <AttendanceItem
            label="참가"
            count={getAttendanceCount("참가")}
            color={Color["green500"]}
          />
        </View>
      )}
    </Animated.View>
  );
};

interface AttendanceItemProps {
  label: AttendanceStatus;
  count: number;
  color: string;
}

const AttendanceItem: React.FC<AttendanceItemProps> = ({
  label,
  count,
  color,
}) => (
  <View style={styles.attendanceItem}>
    <Text style={styles.attendanceLabel}>{label}</Text>
    <Text style={[styles.attendanceCount, { color }]}>
      {count > 0 ? count : "-"}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    marginHorizontal: 28,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey400"],
  },
  viewAllText: {
    textAlign: "right",
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
    color: Color["grey300"],
  },
  spacer: {
    height: 20,
  },
  attendanceContainer: {
    marginHorizontal: 36,
    paddingVertical: 22,
    borderRadius: 15,
    backgroundColor: Color["grey100"],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  attendanceItem: {
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    width: 64,
  },
  attendanceLabel: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
    color: Color["grey700"],
  },
  attendanceCount: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 24,
  },
});
