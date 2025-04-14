import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Session } from "@hongpung/src/entities/session";
import { PhotoFileFormat } from "@hongpung/src/common/types/PhotoFileFormat";

interface PhotoIndicatorProps {
  session: Session;
  photos: PhotoFileFormat[];
  selectedIndex: number;
}

export const PhotoIndicator: React.FC<PhotoIndicatorProps> = ({
  session,
  photos,
  selectedIndex,
}) => {
  const getPhotoDescription = () => {
    if (session?.borrowInstruments && selectedIndex < session?.borrowInstruments.length) {
      return `${session.borrowInstruments[selectedIndex].name} 사진`;
    }
    if (selectedIndex === photos.length - 2) {
      return "연습실 사진";
    }
    if (selectedIndex === photos.length - 1) {
      return "제습기 사진";
    }
    return "";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{getPhotoDescription()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  text: {
    color: "#FFF",
  },
}); 