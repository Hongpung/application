import { defaultSkeletonConfig } from "@hongpung/src/common";
import { Skeleton } from "moti/skeleton";
import { useState, useEffect } from "react";
import { InteractionManager, View } from "react-native";

export const NoticeItemSkeleton: React.FC = () => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setShowSkeleton(true);
    });
  }, []);
  if (!showSkeleton) return null;
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 24, gap: 8 }}>
      <Skeleton {...defaultSkeletonConfig} width="100%" height={20} radius={4} />
      <Skeleton {...defaultSkeletonConfig} width="30%" height={12} radius={4} />
    </View>
  );
};
