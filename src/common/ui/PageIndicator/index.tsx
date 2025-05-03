import React from "react";
import { View, StyleSheet } from "react-native";
import { Color } from "../../constant/color";

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({
  currentPage,
  totalPages,
}) => (
  <View style={styles.indicatorContainer}>
    {Array.from({ length: totalPages }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.indicator,
          currentPage === index && styles.indicatorSelected,
        ]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    backgroundColor: Color.grey200,
    borderRadius: 25,
  },
  indicatorSelected: {
    width: 10,
    height: 10,
    backgroundColor: Color.blue500,
    borderRadius: 25,
  },
}); 