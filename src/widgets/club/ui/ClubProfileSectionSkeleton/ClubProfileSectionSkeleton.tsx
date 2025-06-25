import { View, Text, StyleSheet } from "react-native";

import { Skeleton } from "moti/skeleton";

import { Color, defaultSkeletonConfig } from "@hongpung/src/common";

export const ClubProfileSectionSkeleton: React.FC = () => {
  return (
    <Skeleton.Group show>
      <View style={[styles.profileImageContainer, { position: "relative" }]}>
        <View style={styles.profileImage}>
          <Skeleton width={"100%"} height={"100%"} {...defaultSkeletonConfig} />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.info}>
          <Text style={styles.skeletonLabel}>동아리</Text>
          <Skeleton width={120} height={24} {...defaultSkeletonConfig} />
        </View>
        <View style={styles.info}>
          <Text style={styles.skeletonLabel}>패짱</Text>
          <Skeleton width={120} height={24} {...defaultSkeletonConfig} />
        </View>
        <View style={styles.info}>
          <Text style={styles.skeletonLabel}>상쇠</Text>
          <Skeleton width={120} height={24} {...defaultSkeletonConfig} />
        </View>
      </View>
    </Skeleton.Group>
  );
};

const styles = StyleSheet.create({
  profileImageContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 25,
    borderColor: Color["grey200"],
    borderWidth: 1,
    overflow: "hidden",
  },
  infoContainer: {
    gap: 24,
    paddingVertical: 4,
  },
  info: {
    marginHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skeletonLabel: {
    width: 40,
    height: 16,
    borderRadius: 4,
  },
  skeletonValue: {
    width: 120,
    height: 16,
    borderRadius: 4,
  },
});
