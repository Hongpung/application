import React from "react";
import { View, StyleSheet, FlatList, Pressable, Image } from "react-native";
import { Color } from "../../constant/color";
import { PhotoFileFormat } from "../../types/PhotoFileFormat";

interface ThumbnailListProps {
  photos: PhotoFileFormat[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const ThumbnailList: React.FC<ThumbnailListProps> = ({
  photos,
  selectedIndex,
  onSelect,
}) => {
  return (
    <FlatList
      horizontal
      data={photos}
      renderItem={({ item, index }) => (
        <Pressable
          key={item.uri.slice(-11, -5) + index * 11}
          onPress={() => onSelect(index)}
        >
          <Image
            source={{ uri: item.uri }}
            style={[
              styles.thumbnail,
              index === selectedIndex && styles.selectedThumbnail,
            ]}
          />
        </Pressable>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: 75,
    height: 75,
  },
  selectedThumbnail: {
    borderWidth: 4,
    borderColor: Color["blue400"],
  },
  separator: {
    width: 4,
  },
}); 