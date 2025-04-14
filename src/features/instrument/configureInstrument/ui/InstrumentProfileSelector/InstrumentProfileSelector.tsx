import { Color, Icons } from "@hongpung/src/common";
import { Instrument } from "@hongpung/src/entities/instrument";
import { Pressable, View, Image, Text, StyleSheet } from "react-native";

interface InstrumentProfileSelectorProps {
  instrumentImageUrl?: string;
  selectedImageUri: string | null;
  pickImageFromAlbum: () => void;
}

const InstrumentProfileSelector: React.FC<InstrumentProfileSelectorProps> = ({
  instrumentImageUrl,
  selectedImageUri,
  pickImageFromAlbum,
}) => {
  return (
    <Pressable style={styles.imageContainer} onPress={pickImageFromAlbum}>
      {instrumentImageUrl || selectedImageUri ? (
        <Image
          source={{ uri: selectedImageUri || instrumentImageUrl }}
          style={styles.image}
        />
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
    overflow: "hidden",
    width: 308,
    height: 204,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 308,
    height: 204,
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
});
