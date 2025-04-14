import { View, StyleSheet, Dimensions, Pressable, Text } from "react-native";
import { CameraView, BarcodeScanningResult } from "expo-camera";
import { Icons } from "@hongpung/src/common";
import QRScanBackDrop from "@hongpung/assets/images/QR_SCAN_BACKDROP.svg";

const { width } = Dimensions.get("window");

interface QRScannerProps {
  flash: "on" | "off";
  onToggleFlash: () => void;
  onBarcodeScanned: (result: BarcodeScanningResult) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({
  flash,
  onToggleFlash,
  onBarcodeScanned,
}) => {
  return (
    <CameraView
      style={styles.camera}
      facing={"back"}
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      enableTorch={flash === "on"}
      onBarcodeScanned={onBarcodeScanned}
      ratio="16:9"
    >
      <QRScanBackDrop
        style={{
          position: "absolute",
          left: -420 + 120 + (width - 200) / 2,
          top: 0,
        }}
      />

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={onToggleFlash}>
          <Icons
            name={flash === "on" ? "flashlight-outline" : "flashlight"}
          />
        </Pressable>
        <Text style={styles.descript}>QR코드를 스캔해주세요</Text>
      </View>
    </CameraView>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    marginBottom: 136,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#FFF",
    width: 64,
    height: 64,
    borderRadius: 25,
    justifyContent: "center",
  },
  descript: {
    color: "#FFF",
    marginTop: 42,
    fontFamily: "NanumSquareNeo-ExtraBold",
    fontSize: 16,
  },
});

export default QRScanner; 