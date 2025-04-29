import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LongButton } from "../buttons/LongButton";
import { useCameraPermission } from "../../lib/useCameraPermission";

export const NeedCameraPermssionPanel:React.FC = () => {

  const { requestPermission } = useCameraPermission();

  return (
    <View>
      <Text style={styles.message}>
        QR 코드 스캔을 위해 카메라 권한이 필요해요
      </Text>
      <LongButton
        color="blue"
        innerContent="카메라 권한 설정하기"
        isAble={true}
        onPress={requestPermission}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
