import { ImageStyle, StyleProp, StyleSheet, View } from "react-native";
import { Image, ImageContentFit, ImageSource } from "expo-image";
import { useState, useEffect, useRef } from "react";
import { Color } from "../../constant/color";
import { Skeleton } from "moti/skeleton";

type ImageWithSkeletonProps = {
  imageSource:
    | string
    | number
    | ImageSource
    | ImageSource[]
    | string[]
    | null
    | undefined;
  style?: StyleProp<ImageStyle>;
  cachePolicy?: "none" | "memory-disk" | "disk" | "memory" | null | undefined;
  contentFit?: ImageContentFit;
};

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  imageSource,
  style,
  cachePolicy = null,
  contentFit = "cover",
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isImageError, setIsImageError] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 이미지 로딩 시작 시 100ms 후에 스켈레톤 표시
    if (isImageLoading && !isImageError) {
      timeoutRef.current = setTimeout(() => {
        setShowSkeleton(true);
      }, 100);
    }

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isImageLoading, isImageError]);

  const handleLoadEnd = () => {
    setIsImageLoading(false);
    setShowSkeleton(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleError = () => {
    setIsImageError(true);
    setIsImageLoading(false);
    setShowSkeleton(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <View
      style={[
        style,
        { position: "relative", overflow: "hidden" },
        isImageError && {
          borderWidth: 1,
          borderColor: Color["grey300"],
          backgroundColor: Color["grey200"],
        },
      ]}
    >
      <Image
        source={imageSource}
        style={{ width: "100%", height: "100%" }}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        cachePolicy={cachePolicy}
        contentFit={contentFit}
      />
      {isImageLoading && showSkeleton && (
        <View style={[style, styles.SkeletonOverlay]}>
          <Skeleton
            transition={{
              type: "spring",
              duration: 400,
              delay: 100,
            }}
            width={"100%"}
            height={"100%"}
            colors={[Color["grey100"], Color["grey300"]]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  SkeletonOverlay: {
    position: "absolute",
  },
});
