import React, { useCallback, useEffect } from "react";
import { StyleSheet, View, BackHandler } from "react-native";

import { useStepFlow } from "@hongpung/react-step-flow";

import { Alert, Header } from "@hongpung/src/common";
import { MainStackScreenProps } from "@hongpung/src/common/navigation";

import {
  useCheckOut,
  type CheckOutStepProps,
} from "@hongpung/src/features/session/checkOutRoom";

import {
  CheckOutDescriptionWidget,
  CheckOutConfirmPhotosWidget,
  CheckOutCameraWidget,
  CheckOutCompleteWidget,
  CheckOutSummaryWidget,
} from "@hongpung/src/widgets/session";

export const CheckOutScreen: React.FC<
  MainStackScreenProps<"CheckOutSession">
> = ({ navigation }) => {
  const { currentStep, ...CheckOut } = useStepFlow<CheckOutStepProps>({
    initialStep: "CheckOutDescription",
  });
  const { setCurrentStep, ...checkOutState } = useCheckOut();
  const navigateToHome = useCallback(() => {
    navigation.setOptions({ animation: "none" });
    navigation.navigate("MainTab", { screen: "Home" });
  }, [navigation]);

  const onExitAction = useCallback(() => {
    if (currentStep === "CheckOutSummary") {
      navigateToHome();
      return;
    }
    Alert.confirm("이용 종료", "이용 종료를 취소하시겠습니까?", {
      onConfirm: () => {
        navigateToHome();
      },
      cancelText: "취소",
      confirmText: "확인",
    });
  }, [navigateToHome, currentStep]);

  useEffect(() => {
    // 이용 종료 페이지가 아닌 경우에만 뒤로가기 동작 방지
    if (currentStep !== "CheckOutSummary") {
      const onBackPress = () => {
        onExitAction();
        // 뒤로가기 동작 방지
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => {
        subscription.remove();
      };
    }
  }, [currentStep, onExitAction]);

  if (
    !checkOutState ||
    (checkOutState.photos.length !== checkOutState.demadingPhotoCount &&
      !checkOutState.session)
  ) {
    Alert.alert("오류", "이용 정보가 없습니다.", {
      onConfirm: navigateToHome,
    });
    return null;
  }

  if (
    !checkOutState.session &&
    currentStep !== "CheckOutComplete" &&
    currentStep !== "CheckOutSummary"
  ) {
    Alert.alert("오류", "이용 정보가 없습니다.", {
      onConfirm: navigateToHome,
    });
    return null;
  }

  return (
    <View style={styles.container}>
      <Header LeftButton="close" leftAction={onExitAction} />
      <CheckOut.Flow>
        <CheckOut.Step
          name="CheckOutDescription"
          component={CheckOutDescriptionWidget}
          stepProps={{
            ...checkOutState, // 모든 스텝에 필요한 props를 전달
          }}
        />
        <CheckOut.Step
          name="Camera"
          component={CheckOutCameraWidget}
          stepProps={{
            ...checkOutState,
          }}
        />
        <CheckOut.Step
          name="ConfirmPhotos"
          component={CheckOutConfirmPhotosWidget}
          stepProps={{
            ...checkOutState,
          }}
        />
        <CheckOut.Step
          name="CheckOutComplete"
          component={CheckOutCompleteWidget}
          stepProps={{
            ...checkOutState,
          }}
        />
        <CheckOut.Step
          name="CheckOutSummary"
          component={CheckOutSummaryWidget}
          stepProps={{
            ...checkOutState,
            onHome: navigateToHome,
          }}
        />
      </CheckOut.Flow>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CheckOutScreen;
