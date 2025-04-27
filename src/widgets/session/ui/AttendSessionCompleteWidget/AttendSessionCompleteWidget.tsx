import { Color } from "@hongpung/src/common";
import { CheckInAttendStatus } from "@hongpung/src/features/session/checkInRoom/model/type";
import LottieView from "lottie-react-native";
import { View, Text, StyleSheet } from "react-native";

interface AttendSessionCompleteWidgetProps {
  attendanceStatus: Exclude<CheckInAttendStatus, "지각">;
}

const AttendSessionCompleteWidget: React.FC<AttendSessionCompleteWidgetProps> = ({ attendanceStatus }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>연습 {attendanceStatus} 완료</Text>
      <View
        style={{
          width: 400,
          height: 300,
          marginVertical: 24,
          overflow: "hidden",
          alignSelf: "center",
        }}
      >
        <LottieView
          source={require("@hongpung/assets/lotties/ThunbsUp.json")}
          style={{ width: "100%", height: "100%" }}
          autoPlay
          loop={false}
          speed={1.4}
        />
      </View>
      <View style={{ flexDirection: "column", alignItems: "center", gap: 12 }}>
        <View style={{ flexDirection: "row", alignSelf: "center", gap: 4 }}>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Bold",
              fontSize: 22,
              color: Color["grey700"],
              textAlign: "center",
              marginBottom: 4,
            }}
          >{`정상적으로`}</Text>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Bold",
              fontSize: 22,
              color: Color["blue500"],
              textAlign: "center",
              marginBottom: 4,
            }}
          >{` ${attendanceStatus}`}</Text>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Bold",
              fontSize: 22,
              color: Color["grey700"],
              textAlign: "center",
              marginBottom: 4,
            }}
          >{`했어요!`}</Text>
        </View>
        <Text
          style={{
            fontFamily: "NanumSquareNeo-Bold",
            fontSize: 22,
            color: Color["grey700"],
            textAlign: "center",
          }}
        >{`열심히 연습하세요~`}</Text>
      </View>
    </View>
  );
};

export default AttendSessionCompleteWidget;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  title: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 22,
    color: Color["grey700"],
  },
});
