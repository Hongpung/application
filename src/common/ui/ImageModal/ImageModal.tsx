import {
  Modal,
  Pressable,
  Image as ImageType,
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";

import { useEffect, useState } from "react";
import { ImageWithSkeleton } from "../ImageWithSkeleton/ImageWithSkeleton";
import { confirmAndDownloadImage } from "../../lib/downloadImage";
import { Icons } from "../Icons/Icons";
import { AlertModal } from "../AlertModal/AlertModal";

type ImageModalProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  imageUrl: string;
};

const { width } = Dimensions.get("window");

export const ImageModal: React.FC<ImageModalProps> = ({
  isVisible,
  setIsVisible,
  imageUrl,
}) => {
  const [aspectRatio, setAspectRatio] = useState<number | null>(1);
  const [isImageAspected, setIsImageAspected] = useState<boolean>(false);
  useEffect(() => {
    if (imageUrl) {
      ImageType.getSize(
        imageUrl,
        (width, height) => {
          setAspectRatio(width / height);
          setIsImageAspected(true);
        },
        (error) => {
          console.error(`Couldn't get the image size: ${error.message}`);
        },
      );
    }
  }, [imageUrl]);

  return (
    <Modal visible={isVisible} transparent={true}>
      <AlertModal />
      <Pressable
        onPress={() => setIsVisible(false)}
        style={styles.modalContainer}
      >
        <View
          style={{
            position: "relative",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isImageAspected ? (
            <ImageWithSkeleton
              imageSource={{ uri: imageUrl }}
              style={[
                styles.modalImage,
                {
                  width: width - 36,
                  height: (width - 36) / aspectRatio!,
                  borderRadius: 15,
                },
              ]}
              cachePolicy="memory"
            />
          ) : (
            <ActivityIndicator size="large" color="#FFFFFF" />
          )}
        </View>
        {isImageAspected && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              confirmAndDownloadImage(imageUrl);
            }}
            style={styles.downloadButton}
          >
            <Icons name="download-outline" size={32} color={"#FFF"} />
          </Pressable>
        )}
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalImage: {
    maxHeight: "80%",
    width: 308,
    height: 204,
  },
  downloadButton: {
    position: "absolute",
    bottom: 32,
    right: 24,
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 10,
  },
});
