import React from "react";
import { StyleSheet, View } from "react-native";
import { Header, NeedCameraPermssionPanel } from "@hongpung/src/common";
import { CheckOutConfirmWidget } from "@hongpung/src/widgets/session/ui/CheckOutConfirmWidget";
import { CheckOutDescriptionWidget } from "@hongpung/src/widgets/session/ui/CheckOutDescriptionWidget";
import { CheckOutCameraWidget } from "@hongpung/src/widgets/session/ui/CheckOutCameraWidget";
import { CheckOutConfirmPhotosWidget } from "@hongpung/src/widgets/session/ui/CheckOutConfirmPhotosWidget";
import { CheckOutCompleteWidget } from "@hongpung/src/widgets/session/ui/CheckOutCompleteWidget";

import { useCheckOut } from "@hongpung/src/features/session/checkOutRoom/model/useCheckOut";
import { SessionManagementScreenProps } from "@hongpung/src/common/navigation";
import {
  StepContainer,
  StepScreen,
} from "@hongpung/src/common/lib/useSteps";
import { useCameraPermission } from "@hongpung/src/common/lib/useCameraPermission";
import { ErrorModal } from "@hongpung/src/common";

const CheckOutScreen: React.FC<
  SessionManagementScreenProps<"CheckOutSession">
> = ({ navigation }) => {
  const checkOutState = useCheckOut();

  const { hasPermission } = useCameraPermission();
  const navigateToHome = () =>
    navigation.navigate("MainTab", { screen: "Home" });

  const handleLeftAction = () => {
    if (confirm("이용 종료를 취소하시겠습니까?")) {
      navigateToHome;
    }
  };

  return (
    <View style={styles.container}>
      <ErrorModal
        visible={!checkOutState}
        title={"오류"}
        message={"이용 정보가 없습니다."}
        onConfirm={navigateToHome}
      />
      <Header leftButton="close" leftAction={handleLeftAction} />
      <StepContainer initialStep="CheckOutConfirm">
        <StepScreen name="CheckOutConfirm" screen={CheckOutConfirmWidget} />
        <StepScreen
          name="CheckOutDescription"
          screen={CheckOutDescriptionWidget}
        />
        {hasPermission ? (
          <StepScreen name="Camera" screen={CheckOutCameraWidget} />
        ) : (
          <StepScreen name="Camera" screen={NeedCameraPermssionPanel} />
        )}
        <StepScreen name="ConfirmPhotos" screen={CheckOutConfirmPhotosWidget} />
        <StepScreen name="CheckOutComplete" screen={CheckOutCompleteWidget} />
      </StepContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CheckOutScreen;
