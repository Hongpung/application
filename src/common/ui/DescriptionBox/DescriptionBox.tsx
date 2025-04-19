import React from "react";
import { View, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { Color } from "../..";

interface DescriptionBoxProps {
  descriptions: string[];
  style?: StyleProp<ViewStyle>;
}

export const DescriptionBox: React.FC<DescriptionBoxProps> = ({
  descriptions,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {descriptions.map((description, index) => (
        <Text key={index} style={styles.description}>
          {description}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 36,
    backgroundColor: Color["grey100"],
    paddingVertical: 12,
    borderRadius: 5,
  },
  description: {
    fontSize: 14,
    fontFamily: "NanumSquareNeo-Light",
    color: Color["grey500"],
  },
});
