import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";

type ImagePageProps = {
  imageSource: any;
};

const ImagePage: React.FC<ImagePageProps> = ({ imageSource }) => {
  return (
    <View style={styles.pageContainer}>
      <Image source={imageSource} style={styles.imageStyle} />
    </View>
  );
};

export default ImagePage;

const styles = StyleSheet.create({
  pageContainer: {
    alignItems: "center",
    backgroundColor: "#FFF",
    gap: 12,
    paddingVertical: 24,
  },
  imageStyle: {
    resizeMode: "contain",
    width: 320,
    height: "100%",
  },
});
