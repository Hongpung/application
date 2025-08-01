import React from "react";
import { Pressable, Image } from "react-native";

import { Banner } from "@hongpung/src/entities/banner";

interface BannerProps {
  banner: Banner;
  onBannerPress: (bannerUrl: string) => void;
}

const BannerComponent: React.FC<BannerProps> = ({ banner, onBannerPress }) => {
  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => banner.href && onBannerPress(banner.href)}
    >
      <Image
        src={banner.bannerImgUrl}
        style={{ height: 120, width: "100%", alignItems: "center" }}
        resizeMode="cover"
      />
    </Pressable>
  );
};

export { BannerComponent as Banner };
