import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { CameraView } from "expo-camera";

import { CameraButton } from "@hongpung/src/common/ui/CameraButton";
import { CameraGuideText } from "@hongpung/src/common/ui/CameraGuideText";
import { useCheckOutCamera } from "@hongpung/src/features/session/checkOutRoom/model/useCheckOutCamera";
import { useCameraGuideText } from "@hongpung/src/features/session/checkOutRoom/model/useCameraGuideText";
import { useCameraPermission } from "@hongpung/src/common/lib/useCameraPermission";
import { CheckOutStepProps } from "@hongpung/src/features/session/checkOutRoom/model/types";
import { StepProps } from "@hongpung/react-step-flow";

type CheckOutCameraProps = StepProps<CheckOutStepProps, "Camera">;
export const CheckOutCameraWidget: React.FC<CheckOutCameraProps> = ({
  stepProps: { session, setPhotos, demadingPhotoCount },
  goTo,
}) => {
  const onNext = () => {
    goTo("ConfirmPhotos");
  };
  const { hasPermission, requestPermission } = useCameraPermission();
  const { cameraRef, takePictureHandler, photoLength } = useCheckOutCamera({
    demadingPhotoCount,
    setPhotos,
    onNext,
  });
  const { guideText } = useCameraGuideText({
    session,
    photoLength,
    demadingPhotoCount,
  });

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>카메라 권한이 필요해요</Text>
        <CameraButton onPress={requestPermission} title="카메라 권한 설정" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <CameraGuideText text={guideText} />
        <View style={styles.cameraControls}>
          <CameraButton onPress={takePictureHandler} />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    alignSelf: "center",
    bottom: 90,
    position: "absolute",
    alignItems: "center",
    gap: 32,
  },
  message: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 20,
    textAlign: "center",
    paddingBottom: 10,
  },
});
