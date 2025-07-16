import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Color } from "@hongpung/src/common";
import ImageViewer from "react-native-image-zoom-viewer";
import { usePhotoViewer } from "@hongpung/src/features/session/checkOutRoom/model/usePhotoViewer";
import { ThumbnailList } from "@hongpung/src/common/ui/ThumbnailList/ThumbnailList";
import { PhotoIndicator } from "@hongpung/src/features/session/checkOutRoom/ui/PhotoIndicator/PhotoIndicator";
import { CheckOutStepProps } from "@hongpung/src/features/session/checkOutRoom/model/types";
import { StepProps } from "@hongpung/react-step-flow";

type CheckOutConfirmPhotosProps = StepProps<CheckOutStepProps, "ConfirmPhotos">;
export const CheckOutConfirmPhotosWidget: React.FC<
  CheckOutConfirmPhotosProps
> = ({ stepProps: { session, photos }, goTo }) => {
  const onNext = () => {
    goTo("CheckOutComplete");
  };
  const {
    selectedIndex,
    indicatorVisible,
    handleIndexChange,
    toggleIndicator,
  } = usePhotoViewer({
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
        <>
          <Pressable
            style={{
              position: "absolute",
              top: -48,
              alignSelf: "flex-end",
              zIndex: 2,
              padding: 16,
              backgroundColor: "#FFF",
              borderRadius: 24,
            }}
            onPress={onNext}
          >
            <Text style={{ fontFamily: "NanumSquareNeo-Regular" }}>
              제출하기
            </Text>
          </Pressable>
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
        </>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    bottom: 4,
    zIndex: 3,
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
});
