import { defaultSkeletonConfig } from "@hongpung/src/common";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { ScrollView } from "react-native";

export const ReservationDetailSkeleton: React.FC = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#FFF",
        gap: 32,
        position: "relative",
        paddingHorizontal: 24,
        alignItems: "center",
        paddingVertical: 36,
      }}
    >
      <Skeleton
        {...defaultSkeletonConfig}
        width={"100%"}
        height={120}
        radius={16}
      />
      <Skeleton
        {...defaultSkeletonConfig}
        width={"100%"}
        height={240}
        radius={16}
      />
      <Skeleton
        {...defaultSkeletonConfig}
        width={"100%"}
        height={200}
        radius={16}
      />
    </ScrollView>
  );
};
