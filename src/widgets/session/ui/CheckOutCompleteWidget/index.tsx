import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { LongButton } from "@hongpung/src/common";
import { Color } from "@hongpung/src/common";
import { Session } from "@hongpung/src/entities/session";
import LottieView from "lottie-react-native";

interface CheckOutCompleteWidgetProps {
  session: Session;
  isLoading: boolean;
  onHome: () => void;
}

export const CheckOutCompleteWidget: React.FC<CheckOutCompleteWidgetProps> = ({
  session,
  isLoading,
  onHome,
}) => {
  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            style={styles.loadingIndicator}
            color={Color["blue500"]}
            size={100}
          />
        </View>
      ) : (
        <>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{`연습 종료`}</Text>
            <View style={styles.lottieContainer}>
              <LottieView
                source={require("@hongpung/assets/lotties/Clab.json")}
                style={styles.lottie}
                autoPlay
                speed={1}
              />
            </View>
            <View>
              <Text style={styles.sessionTitle}>
                {session.title.length > 10 ? session.title.slice(0, 10) + "..." : session.title} 연습이
              </Text>
              <Text style={styles.completeText}>{`무사히 종료됐어요~\n고생했어요!`}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <LongButton
              color="blue"
              innerContent={`홈으로`}
              isAble={true}
              onPress={onHome}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    alignSelf: "center",
    marginVertical: 24,
    width: 180,
    height: 180,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    gap: 24,
  },
  title: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 22,
    color: Color["grey700"],
    textAlign: "center",
  },
  lottieContainer: {
    width: 400,
    height: 300,
    marginVertical: 24,
    alignSelf: "center",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  sessionTitle: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 22,
    color: Color["grey700"],
    textAlign: "center",
  },
  completeText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 22,
    color: Color["grey700"],
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingVertical: 12,
  },
});
