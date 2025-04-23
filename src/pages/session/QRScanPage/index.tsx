import { Header } from "@hongpung/src/common";
import { View, StyleSheet } from "react-native";
import { useCameraPermission } from "@hongpung/src/common/lib/useCameraPermission";
import { useQRScanner } from "@hongpung/src/features/session/qr/lib/useQRScanner";
import QRScanFailedModal from "@hongpung/src/widgets/session/ui/QRScanFailedModal/QRScanFailedModal";
import QRScanner from "@hongpung/src/features/session/qr/ui/QRScanner/QRScanner";
import React from "react";
import { MainTabScreenProps } from "@hongpung/src/navigation/MainTabNavigation";
import NeedCameraPermssionPanel from "@hongpung/src/widgets/permission/ui/NeedCameraPermssionPanel/NeedCameraPermssionPanel";

const QRScanPage: React.FC<MainTabScreenProps<"QRCode">> = ({ navigation }) => {
  const handleScanSuccess = () => {
    navigation.push("CheckIn");
  };

  const { hasPermission } = useCameraPermission();
  const { scanStatus, resetScanStatus, flash, toggleFlash, onScanned } =
    useQRScanner({ onSuccess: handleScanSuccess });

  return (
    <View style={{ flex: 1 }}>
      <Header
        HeaderName="QR 코드 스캔"
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
