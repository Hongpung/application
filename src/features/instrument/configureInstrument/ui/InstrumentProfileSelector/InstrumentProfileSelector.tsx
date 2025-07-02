import { Color, Icons, ImageWithSkeleton } from "@hongpung/src/common";

import { Pressable, View, Text, StyleSheet, Alert } from "react-native";
import React from "react";

interface InstrumentProfileSelectorProps {
  selectedImageUri: string | null;
  pickImageFromAlbum: () => void;
  onResetImage: () => void;
}

const InstrumentProfileSelector: React.FC<InstrumentProfileSelectorProps> = ({
  selectedImageUri,
  pickImageFromAlbum,
  onResetImage,
}) => {
  const onConfirmChange = () => {
    if (selectedImageUri) {
      Alert.alert(
        "프로필 이미지 변경",
        "프로필 이미지를 변경하시겠습니까?",
        [
          {
            text: "확인",
            isPreferred: true,
            onPress: () => {
              pickImageFromAlbum();
            },
          },
          {
            text: "취소",
            style: "destructive",
          },
          {
            text: "프로필 이미지 제거",
            style: "destructive",
            onPress: () => {
              onResetImage();
            },
          },
        ],
        { cancelable: true },
      );
    } else {
      pickImageFromAlbum();
    }
  };

  return (
    <Pressable style={styles.imageContainer} onPress={onConfirmChange}>
      {selectedImageUri ? (
        <>
          <ImageWithSkeleton
            imageSource={selectedImageUri}
            style={styles.image}
            contentFit="cover"
          />
          <View style={styles.cameraIconContainer}>
            <Icons name="camera" size={24} color={Color["grey400"]} />
          </View>
        </>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Icons name="add" size={64} color={Color["grey400"]} />
          <Text style={styles.imagePlaceholderText}>
            이미지를 추가할 수 있어요
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default InstrumentProfileSelector;

const styles = StyleSheet.create({
  imageContainer: {
    width: 308,
    height: 204,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 308,
    height: 204,
    borderRadius: 10,
  },
  imagePlaceholder: {
    backgroundColor: Color["grey200"],
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    width: 308,
    height: 204,
    borderRadius: 10,
  },
  imagePlaceholderText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 14,
    color: Color["grey400"],
  },
  cameraIconContainer: {
    position: "absolute",
    backgroundColor: Color["grey100"],
    borderRadius: 100,
    width: 32,
    height: 32,
    bottom: -8,
    right: -8,
    justifyContent: "center",
    alignItems: "center",
  },
});
