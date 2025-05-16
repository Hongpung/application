import { Color, defaultSkeletonConfig } from "@hongpung/src/common";
import { Skeleton } from "moti/skeleton";
import { useState, useEffect } from "react";
import { View, StyleSheet, InteractionManager } from "react-native";

export const NoticeDetailSekeleton: React.FC = () => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setShowSkeleton(true);
    });
  }, []);

  if (!showSkeleton) return null;

  return (
    <View style={styles.contentContainer}>
      <View style={styles.noticeCard}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: 12,
          }}
        >
          <Skeleton {...defaultSkeletonConfig} width="80%" height={24} />
        </View>

        <View style={styles.separator} />
        <View style={styles.noticeContentSkeleton}>
          <Skeleton {...defaultSkeletonConfig} width="100%" height={28} />
          <Skeleton {...defaultSkeletonConfig} width="80%" height={28} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  contentContainer: {
    display: "flex",
    flex: 1,
    backgroundColor: Color["grey100"],
  },
  noticeCard: {
    flex: 1,
    display: "flex",
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
  },
  separator: {
    marginVertical: 12,
    borderWidth: 0.25,
    borderColor: Color["grey200"],
  },
  noticeContentSkeleton: {
    paddingVertical: 4,
    marginHorizontal: 4,
    gap: 12,
    display: "flex",
    flexDirection: "column",
  },
});
