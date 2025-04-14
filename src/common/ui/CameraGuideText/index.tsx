import React from "react";
import { View, StyleSheet,Text } from "react-native";

interface CameraGuideTextProps {
  text: string;
}

export const CameraGuideText: React.FC<CameraGuideTextProps> = ({
  text,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 24,
  },
  text: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
}); 