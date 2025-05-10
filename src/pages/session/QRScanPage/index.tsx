import { Header } from "@hongpung/src/common";
import { View, StyleSheet } from "react-native";
import { useCameraPermission } from "@hongpung/src/common/lib/useCameraPermission";
import { useQRScanner } from "@hongpung/src/features/session/qr/lib/useQRScanner";
import QRScanFailedModal from "@hongpung/src/widgets/session/ui/QRScanFailedModal/QRScanFailedModal";
import QRScanner from "@hongpung/src/features/session/qr/ui/QRScanner/QRScanner";
import React from "react";
import { MainTabScreenProps } from "@hongpung/src/common/navigation";
import { NeedCameraPermssionPanel } from "@hongpung/src/common";

const QRScanPage: React.FC<MainTabScreenProps<"QRCode">> = ({ navigation }) => {
  const handleScanSuccess = (data: string) => {
    if (data === "https://app.hongpung.com/qr") {
      navigation.jumpTo("Home");
      navigation.push("CheckIn");
    }
  };

  const { hasPermission } = useCameraPermission();
  const { scanStatus, resetScanStatus, flash, toggleFlash, onScanned } =
    useQRScanner({ onSuccess: handleScanSuccess });

  return (
    <View style={{ flex: 1 }}>
      <Header
        headerName="QR 코드 스캔"
        leftButton="close"
        leftAction={() => navigation.jumpTo("Home")}
      />
      <View style={styles.container}>
        {hasPermission ? (
          <QRScanner
            flash={flash}
            onToggleFlash={toggleFlash}
            onBarcodeScanned={onScanned}
          />
        ) : (
          <NeedCameraPermssionPanel />
        )}
      </View>
      <QRScanFailedModal
        visible={scanStatus === "FAILED"}
        onClose={resetScanStatus}
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

export default QRScanPage;
