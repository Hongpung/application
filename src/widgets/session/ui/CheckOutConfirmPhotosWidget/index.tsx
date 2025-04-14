import React from "react";
import { View, StyleSheet } from "react-native";
import { Color } from "@hongpung/src/common";
import { Session } from "@hongpung/src/entities/session";
import { PhotoFileFormat } from "@hongpung/src/common/types/PhotoFileFormat";
import ImageViewer from "react-native-image-zoom-viewer";
import { usePhotoViewer } from "../../../../features/session/checkOutRoom/model/usePhotoViewer";
import { ThumbnailList } from "../../../../common/ui/ThumbnailList/ThumbnailList";
import { PhotoIndicator } from "../../../../features/session/checkOutRoom/ui/PhotoIndicator/PhotoIndicator";

interface CheckOutConfirmPhotosWidgetProps {
  session: Session;
  photos: PhotoFileFormat[];
  onEnd: () => void;
}

export const CheckOutConfirmPhotosWidget: React.FC<CheckOutConfirmPhotosWidgetProps> = ({
  session,
  photos,
}) => {
  const { selectedIndex, indicatorVisible, handleIndexChange, toggleIndicator } = usePhotoViewer({
    photos,
  });

  return (
    <View style={styles.container}>
      {photos.length > 0 && (
        <View style={[styles.imageViewerContainer, { zIndex: 0 }]}>
          <ImageViewer
            key={photos.length}
            onChange={(index) => handleIndexChange(index!)}
            index={selectedIndex}
            renderIndicator={() => <View />}
            enableImageZoom
            onClick={toggleIndicator}
            enableSwipeDown
            swipeDownThreshold={10}
            imageUrls={photos.map((image) => ({ url: image.uri }))}
            style={styles.imageViewer}
          />
        </View>
      )}
      {indicatorVisible && (
        <View style={styles.indicatorContainer}>
          <PhotoIndicator
            session={session}
            photos={photos}
            selectedIndex={selectedIndex}
          />
          <ThumbnailList
            photos={photos}
            selectedIndex={selectedIndex}
            onSelect={handleIndexChange}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  imageViewerContainer: {
    flex: 1,
  },
  imageViewer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "auto",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 4,
    zIndex: 3,
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
});
