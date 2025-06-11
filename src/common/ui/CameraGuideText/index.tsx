import React from "react";
import { View, StyleSheet, Text } from "react-native";

interface CameraGuideTextProps {
  text: string;
}

export const CameraGuideText: React.FC<CameraGuideTextProps> = ({ text }) => {
  return (
    <View style={{ alignItems: "center", paddingTop: 24 }}>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 16,
    width: "auto",
    paddingVertical: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
  },
});
