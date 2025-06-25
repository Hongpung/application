import { Dimensions, View, ViewStyle } from "react-native";

import { Color, defaultSkeletonConfig } from "@hongpung/src/common";
import { Skeleton } from "moti/skeleton";

interface ReservationCardSkeletonProps {
  style?: ViewStyle;
}

const { width } = Dimensions.get("window");

export const ReservationCardSkeleton: React.FC<
  ReservationCardSkeletonProps
> = ({ style }) => {
  return (
    <View
      style={{
        position: "absolute",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Color["grey100"],
        width: width - 72,
        backgroundColor: "#FFF",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* title */}
      <View
        style={{
          position: "absolute",
          top: style?.height && Number(style?.height) > 40 ? 16 : 8,
          left: 12,
        }}
      >
        <Skeleton
          {...defaultSkeletonConfig}
          height={20}
          width={64}
          radius={4}
        />
      </View>

      {/* 내부 요소 분기 처리 */}
      {style?.height && Number(style?.height) > 80 && (
        <View
          style={{
            position: "absolute",
            bottom: 12,
            flexDirection: "row",
            width: "100%",
            paddingHorizontal: 12,
            gap: 4,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Skeleton
            {...defaultSkeletonConfig}
            height={20}
            width={48}
            radius={4}
          />

          <Skeleton
            {...defaultSkeletonConfig}
            height={20}
            width={108}
            radius={4}
          />
        </View>
      )}
    </View>
  );
};
