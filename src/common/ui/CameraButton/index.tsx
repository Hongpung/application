import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";

interface CameraButtonProps {
  onPress: () => void;
  title?: string;
}

export const CameraButton: React.FC<CameraButtonProps> = ({
  onPress,
  title,
}) => {
  if (title) {
    return (
      <Pressable onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.cameraButton} onPress={onPress}>
      <View style={styles.cameraButtonInner} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
  },
  cameraButton: {
    width: 64,
    height: 64,
    borderColor: "#FFF",
    borderWidth: 3,
    backgroundColor: "transparent",
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButtonInner: {
    width: 52,
    height: 52,
    backgroundColor: "#FFF",
    alignSelf: "center",
    position: "absolute",
    borderRadius: 100,
  },
});
