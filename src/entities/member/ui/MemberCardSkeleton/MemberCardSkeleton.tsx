import React, { useEffect, useState } from "react";
import { View, StyleSheet, InteractionManager } from "react-native";
import { Skeleton } from "moti/skeleton";
import { Color, defaultSkeletonConfig } from "@hongpung/src/common";

const MemberCardSkeleton: React.FC = () => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setShowSkeleton(true);
    });
  }, []);

  if (!showSkeleton) return null;

  return (
    <Skeleton.Group show>
      <View style={styles.container}>
        {/* 프로필 사진 */}
        <Skeleton
          {...defaultSkeletonConfig}
          width={60}
          height={80}
          radius={5}
        />

        {/* 텍스트 부분 */}
        <View style={styles.textContainer}>
          <Skeleton
            {...defaultSkeletonConfig}
            width="40%"
            height={16}
            radius={4}
          />
          <Skeleton
            {...defaultSkeletonConfig}
            width="60%"
            height={14}
            radius={4}
          />
        </View>
      </View>
    </Skeleton.Group>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 112,
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: Color["grey100"],
    backgroundColor: "#FFF",
    gap: 24,
    padding: 16,
  },
  profilePhoto: {
    marginRight: 24,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
  },
  namePlaceholder: {
    marginBottom: 8,
  },
  nicknamePlaceholder: {},
});

export default React.memo(MemberCardSkeleton);
