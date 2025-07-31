import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  FlatList,
  Pressable,
} from "react-native";

import { Color, ImageWithSkeleton } from "@hongpung/src/common";

interface SessionImageGalleryProps {
  images: string[];
  animatedStyle?: any;
  onImagePress?: (imageUrl: string) => void;
}

export const SessionImageGallery: React.FC<SessionImageGalleryProps> = ({
  images,
  animatedStyle,
  onImagePress,
}) => {
  if (!images || images.length === 0) {
    return null;
  }

  const renderImageItem = ({ item }: { item: string }) => (
    <Pressable
      style={styles.imageContainer}
      onPress={() => onImagePress?.(item)}
    >
      <ImageWithSkeleton
        imageSource={{ uri: item }}
        style={styles.image}
        cachePolicy={"memory"}
        contentFit="cover"
      />
    </Pressable>
  );

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>종료 사진</Text>
      </View>

      <View style={styles.spacer} />

      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={images}
        renderItem={renderImageItem}
        ItemSeparatorComponent={() => <View style={styles.imageSeparator} />}
        keyExtractor={(_, index) => `image-${index}`}
        ListHeaderComponent={<View style={styles.listPadding} />}
        ListFooterComponent={<View style={styles.listPadding} />}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginHorizontal: 28,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey400"],
  },
  viewAllText: {
    textAlign: "right",
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
    color: Color["grey300"],
  },
  spacer: {
    height: 20,
  },
  imageContainer: {
    width: 120,
    height: 160,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: Color["grey200"],
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageSeparator: {
    width: 12,
  },
  listPadding: {
    width: 18,
  },
});
