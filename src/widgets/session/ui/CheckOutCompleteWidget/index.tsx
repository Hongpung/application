import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Color } from "@hongpung/src/common";
import { useCompleteAnimation } from "@hongpung/src/features/session/checkOutRoom/lib/useCompleteAnimation";
import LottieView from "lottie-react-native";
import { CheckOutStepProps } from "@hongpung/src/features/session/checkOutRoom/model/types";
import { StepProps } from "@hongpung/react-step-flow";

type CheckOutCompleteProps = StepProps<CheckOutStepProps, "CheckOutComplete">;

export const CheckOutCompleteWidget: React.FC<CheckOutCompleteProps> = ({
  stepProps: { isLoading, endSession },
  goTo,
}) => {
  const { clapCount, animatedStyle, handleLottieFinish } = useCompleteAnimation(
    isLoading,
    () => goTo("CheckOutSummary"),
  );

  useEffect(() => {
    endSession();
  }, [endSession]);

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
        <Animated.View style={[animatedStyle, styles.contentContainer]}>
          <LottieView
            key={clapCount}
            source={require("@hongpung/assets/lotties/Clab.json")}
            style={styles.lottie}
            autoPlay
            loop={false}
            speed={1}
            onAnimationFinish={handleLottieFinish}
          />

          <View style={{ height: 120 }}>
            <Text
              style={styles.completeText}
            >{`연습실 사용이 종료됐어요~\n고생했어요!`}</Text>
          </View>
        </Animated.View>
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
    justifyContent: "center",
    gap: 8,
  },
  lottie: {
    width: "100%",
    height: 300,
  },
  completeText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 22,
    color: Color["grey700"],
    textAlign: "center",
  },
});
