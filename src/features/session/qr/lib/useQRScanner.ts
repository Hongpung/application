import { BarcodeScanningResult } from "expo-camera";
import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { Platform, Dimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");

type ScanStatus = "IDLE" | "PROCESSING" | "COMPLETE" | "FAILED";

export const useQRScanner = ({
  onSuccess,
}: {
  onSuccess: (data: string) => void;
}) => {
  const isFocusing = useIsFocused();

  const [scanStatus, setScanStatus] = useState<ScanStatus>("IDLE");
  const [flash, setFlash] = useState<"on" | "off">("off");

  const resetScanStatus = useCallback(() => {
    setScanStatus("IDLE");
    setFlash("off");
    console.log("resetScanStatus");
  }, []);

  useEffect(() => {
    resetScanStatus();
  }, [isFocusing, resetScanStatus]);

  const toggleFlash = useCallback(() => {
    setFlash((prev) => (prev === "on" ? "off" : "on"));
  }, []);

  const isInCenter = useCallback((x: number, y: number) => {
    const centerWidth = 200;
    const centerHeight = 200;
    const centerX = width / 2;
    const centerY = 220;

    return (
      x > centerX - centerWidth / 2 &&
      x < centerX + centerWidth / 2 &&
      y > centerY - centerHeight / 2 &&
      y < centerY + centerHeight / 2
    );
  }, []);

  const handleScanned = useCallback(
    ({ type, data, bounds }: BarcodeScanningResult) => {
      if (scanStatus !== "IDLE" || type !== "qr") return;

      console.log("handleScanned", data);

      const { origin, size } = bounds;

      if (Platform.OS === "ios") {
        const centerX = origin.x + size.width / 2;
        const centerY = origin.y + size.height / 2;

        if (isInCenter(centerX, centerY)) {
          setScanStatus("PROCESSING");
          onSuccess(data);
          return;
        }
      } else if (Platform.OS === "android") {
        const centerX = origin.y + size.height / 2;
        const centerY = origin.x + size.height / 2;

        if (isInCenter(centerX, centerY)) {
          setScanStatus("PROCESSING");
          onSuccess(data);
          return;
        }
      }
      return null;
    },
    [scanStatus, isInCenter, onSuccess],
  );

  const onScanned = debounce(handleScanned, 200, {
    leading: true,
    trailing: false,
  });

  return {
    scanStatus,
    flash,
    resetScanStatus,
    toggleFlash,
    onScanned,
  };
};
