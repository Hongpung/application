import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Color, Header } from "@hongpung/src/common";

import { BannerSlider, BannerTabView } from "@hongpung/src/widgets/banner";

export const BannerListPage: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Header headerName="배너 목록" LeftButton={"arrow-back"} />
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={[Color["grey100"], Color["grey200"]]}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 16,
          }}
        >
          <BannerSlider showAllButton={false} />
        </LinearGradient>
        <BannerTabView />
      </View>
    </View>
  );
};
