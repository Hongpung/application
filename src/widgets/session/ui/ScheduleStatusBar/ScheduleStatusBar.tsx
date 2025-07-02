import { Color } from "@hongpung/src/common";
import { View, Text, StyleSheet } from "react-native";

type ScheduleStatusBarProps = {
  isOnAir: "PREPARING" | "ON_AIR" | "CLOSED" | "AVAILABLE";
  isParticipatible: boolean;
};

export const ScheduleStatusBar: React.FC<ScheduleStatusBarProps> = ({
  isOnAir,
  isParticipatible,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>연습실 이용상태</Text>
      <View style={styles.statusContainer}>
        {isOnAir === "ON_AIR" && isParticipatible && (
          <Text style={[styles.statusBadge, styles.participatible]}>
            참여가능
          </Text>
        )}
        {isOnAir === "ON_AIR" && !isParticipatible ? (
          <Text style={[styles.statusBadge, styles.inUse]}>사용중</Text>
        ) : isOnAir === "AVAILABLE" ? (
          <Text style={[styles.statusBadge, styles.available]}>사용 가능</Text>
        ) : isOnAir === "PREPARING" ? (
          <Text style={[styles.statusBadge, styles.unavailable]}>준비중</Text>
        ) : (
          <Text style={[styles.statusBadge, styles.unavailable]}>
            이용 불가
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 32,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 20,
  },
  statusContainer: {
    flexDirection: "row",
  },
  statusBadge: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 12,
    borderRadius: 5,
    padding: 6,
    marginLeft: 4,
  },
  participatible: {
    color: Color["green500"],
    backgroundColor: Color["green200"],
  },
  inUse: {
    color: Color["red500"],
    backgroundColor: Color["red100"],
  },
  available: {
    color: Color["blue500"],
    backgroundColor: Color["blue100"],
  },
  unavailable: {
    color: Color["grey500"],
    backgroundColor: Color["grey100"],
  },
});
