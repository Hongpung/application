import React from "react";
import { View, StyleSheet, Text } from "react-native";
import LottieView from "lottie-react-native";
import { Color } from "@hongpung/src/common";
import { PageContent } from "@hongpung/src/common/types/PageContent";

export const DescriptionPage: React.FC<PageContent> = ({
  lottieSource,
  description,
  speed = 1,
}) => (
  <View style={styles.page}>
    <View style={styles.picture}>
      <LottieView
        source={lottieSource}
        style={styles.lottie}
        autoPlay
        speed={speed}
      />
    </View>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  picture: {
    width: "100%",
    height: 300,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  description: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 20,
    color: Color.grey700,
    textAlign: "center",
  },
});
