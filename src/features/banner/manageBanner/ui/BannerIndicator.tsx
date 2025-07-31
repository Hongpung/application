import { View, Text, Pressable } from "react-native";
import { Icons, Color } from "@hongpung/src/common";

const BannerIndicator: React.FC<{
  bannerIndex: number;
  bannerLength: number;
  onPress: () => void;
  showAllButton?: boolean;
}> = ({ bannerIndex, bannerLength, onPress, showAllButton = true }) => {
  return (
    <View
      style={{
        position: "absolute",
        backgroundColor: Color["grey600"],
        bottom: 8,
        right: 8,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: Color["grey100"],
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 4,
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        <Text
          style={{
            fontFamily: "NanumSquareNeo-Regular",
            color: "#FFF",
            padding: 4,
            fontSize: 12,
            textAlignVertical: "center",
            textAlign: showAllButton ? "right" : "center",
          }}
        >
          {(bannerIndex + 1).toString().padStart(2, "0")}/
          {bannerLength.toString().padStart(2, "0")}
        </Text>
        {showAllButton && (
          <Pressable
            onPress={onPress}
            style={{
              justifyContent: "flex-end",
              gap: 2,
              paddingVertical: 4,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "NanumSquareNeo-Regular",
                color: "#FFF",
                fontSize: 11,
                textAlign: "center",
              }}
            >
              모두보기
            </Text>
            <Icons
              name="chevron-forward-outline"
              color={Color["grey300"]}
              size={12}
            ></Icons>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default BannerIndicator;
