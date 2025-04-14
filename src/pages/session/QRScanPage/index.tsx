import { Header } from "@hongpung/src/common/ui/Header/Header";
import { View, StyleSheet, Text, Alert } from "react-native";
import { LongButton } from "@hongpung/src/common";
import { useCameraPermission } from "@hongpung/src/common/lib/useCameraPermission";
import { useQRScanner } from "@hongpung/src/features/session/qr/lib/useQRScanner";
import QRScanFailedModal from "@hongpung/src/widgets/session/ui/QRScanFailedModal/QRScanFailedModal";
import QRScanner from "@hongpung/src/features/session/qr/ui/QRScanner/QRScanner";
import React from "react";

const QRScanPage: React.FC<MainStackProps<"QRScan">> = ({ navigation }) => {
  const handleScanSuccess = () => {
    navigation.navigate("CheckIn");
  };

  const { hasPermission, requestPermission } = useCameraPermission();
  const { scanStatus, resetScanStatus, flash, toggleFlash, onScanned } =
    useQRScanner({ onSuccess: handleScanSuccess });

  if (!hasPermission) {
    return (
      <View style={styles.container}>
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
  }

  return (
    <>
      <View>
        <Header HeaderName="QR 코드 스캔" leftButton="close" />
        <View style={styles.container}>
          <QRScanner
            flash={flash}
            onToggleFlash={toggleFlash}
            onBarcodeScanned={onScanned}
          />
        </View>
      </View>
      <QRScanFailedModal
        visible={scanStatus === "FAILED"}
        onClose={resetScanStatus}
      />
    </>
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

export default QRScanPage;
