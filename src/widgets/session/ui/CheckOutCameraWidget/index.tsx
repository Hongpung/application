import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { CameraView } from "expo-camera";
import { Session } from "@hongpung/src/entities/session";
import { PhotoFileFormat } from "@hongpung/src/common/types/PhotoFileFormat";
import { Color } from "@hongpung/src/common";
import { CameraButton } from "@hongpung/src/common/ui/CameraButton";
import { CameraGuideText } from "@hongpung/src/common/ui/CameraGuideText";
import { useCheckOutCamera } from "../../../../features/session/checkOutRoom/model/useCheckOutCamera";
import { useCameraGuideText } from "../../../../features/session/checkOutRoom/model/useCameraGuideText";
import { useCameraPermission } from "@hongpung/src/common/lib/useCameraPermission";

interface CheckOutCameraWidgetProps {
  session: Session;
  photos: PhotoFileFormat[];
  setPhotos: React.Dispatch<PhotoFileFormat[]>;
  onNext: () => void;
}

export const CheckOutCameraWidget: React.FC<CheckOutCameraWidgetProps> = ({
  session,
  photos,
  setPhotos,
  onNext,
}) => {
  
  const { hasPermission, requestPermission } = useCameraPermission();
  const { cameraRef, takePictureHandler, shootingCount } = useCheckOutCamera({
    session,
    photos,
    setPhotos,
    onNext,
  });
  const { guideText } = useCameraGuideText({
    session,
    photos,
    shootingCount,
  });

  if (!hasPermission) {
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
        <View style={styles.cameraControls}>
          <CameraGuideText text={guideText} />
          <CameraButton onPress={takePictureHandler} />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
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
