import React from "react";
import { View, StyleSheet } from "react-native";

import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const MemberCardSkeleton: React.FC = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.profilePhoto} />
        <View style={styles.textContainer}>
          <View style={styles.namePlaceholder} />
          <View style={styles.nicknamePlaceholder} />
        </View>
      </View>
    </SkeletonPlaceholder>
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
    backgroundColor: "#FFF",
    padding: 16,
  },
  profilePhoto: {
    width: 60,
    height: 80,
    borderRadius: 5,
    marginRight: 24,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  namePlaceholder: {
    width: "50%",
    height: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  nicknamePlaceholder: {
    width: "30%",
    height: 14,
    borderRadius: 4,
  },
});

export default MemberCardSkeleton;
