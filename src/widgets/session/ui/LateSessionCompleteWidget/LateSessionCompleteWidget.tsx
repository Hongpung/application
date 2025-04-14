import LottieView from "lottie-react-native";
import { View, StyleSheet, Text } from "react-native";
import { Color } from "@hongpung/src/common";

interface LateSessionCompleteWidgetProps {
  startTime: string;
}

const LateSessionCompleteWidget: React.FC<LateSessionCompleteWidgetProps> = ({ startTime }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>연습 출석 완료</Text>
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
          source={require("@hongpung/assets/lotties/YellowCard.json")}
          style={{ width: "100%", height: "100%" }}
          autoPlay
          speed={0.8}
        />
      </View>
      <View style={{ flexDirection: "column", alignItems: "center", gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Bold",
              fontSize: 22,
              color: Color["red500"],
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            {Math.floor((Date.now() - new Date(startTime).getTime()) / 60000)}
          </Text>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Bold",
              fontSize: 22,
              color: Color["grey700"],
              textAlign: "center",
              marginBottom: 4,
            }}
          >{`분`}</Text>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Bold",
              fontSize: 22,
              color: Color["red500"],
              textAlign: "center",
              marginBottom: 4,
            }}
          >{` 지각`}</Text>
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
        >{`그래도 눈치보지 말고 연습하세요~`}</Text>
      </View>
    </View>
  );
};

export default LateSessionCompleteWidget;

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
