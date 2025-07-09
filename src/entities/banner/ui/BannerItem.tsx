import React from "react";
import { Pressable } from "react-native";

import { Banner } from "../model/type";
import { Color, ImageWithSkeleton } from "@hongpung/src/common";

interface BannerItemProps {
  banner: Banner;
  onBannerPress: (bannerUrl: string) => void;
}

const BannerItem: React.FC<BannerItemProps> = (props) => {
  const { banner, onBannerPress } = props;

  return (
    <Pressable
      style={{
        flex: 1,
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: Color["grey100"],
      }}
      onPress={() => banner.href && onBannerPress(banner.href)}
    >
      <ImageWithSkeleton
        imageSource={{ uri: banner.bannerImgUrl }}
        style={{ height: 120, width: "100%", alignItems: "center" }}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
    </Pressable>
  );
};

export { BannerItem };
