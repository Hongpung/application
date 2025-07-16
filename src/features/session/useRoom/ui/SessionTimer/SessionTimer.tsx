import { View, Text, StyleSheet } from "react-native";

interface SessionTimerProps {
  remainingHour: string;
  remainingMinute: string;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({
  remainingHour,
  remainingMinute,
}) => {
  return (
    <View style={styles.container}>
      {Number(remainingHour) !== 0 && (
        <Text style={styles.hourText}>{remainingHour}</Text>
      )}
      <Text style={styles.minuteText}>{remainingMinute}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 110,
    gap: 12,
  },
  hourText: {
    fontFamily: "NanumSquareNeo-Bold",
    color: "#FFF",
    fontSize: 14,
  },
  minuteText: {
    fontFamily: "NanumSquareNeo-Bold",
    color: "#FFF",
    fontSize: 14,
  },
});
