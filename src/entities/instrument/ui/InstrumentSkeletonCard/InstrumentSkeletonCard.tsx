import { Skeleton } from "moti/skeleton";
import { View, StyleSheet, InteractionManager } from "react-native";
import { Color } from "@hongpung/src/common";
import { useEffect, useState } from "react";
import { MotiTransitionProp } from "moti/build/core";

export const InstrumentSkeletonCard = () => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setShowSkeleton(true);
    });
  }, []);

  const skeletonProps = {
    transition: {
      type: "spring",
      duration: 400,
      delay: 100,
    } satisfies MotiTransitionProp,
    colors: [Color["grey100"], Color["grey300"]],
  };

  if (!showSkeleton) return null;

  return (
    <Skeleton.Group show={true}>
      <View style={[styles.card, { height: 156 }]}>
        <View>
          {/* 이미지 영역 */}
          <View style={styles.imageContainer}>
            <Skeleton width={132} height={88} radius={5} {...skeletonProps} />
          </View>

          {/* 태그 영역 */}
          <View style={styles.tagContainer}>
            <Skeleton width={40} height={18} radius={4} {...skeletonProps} />
          </View>

          {/* 이름 영역 */}
          <View style={styles.nameContainer}>
            <Skeleton width={80} height={18} radius={4} {...skeletonProps} />
          </View>
        </View>
      </View>
    </Skeleton.Group>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 154,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Color["grey200"],
  },
  imageContainer: {
    overflow: "hidden",
    width: 132,
    height: 88,
    borderRadius: 5,
    marginLeft: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tagContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 8,
    height: 18,
  },
  nameContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 4,
    height: 18,
  },
});
