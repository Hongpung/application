import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { Color } from "@hongpung/src/common";
import { BannerItem, useLoadBannersFetch } from "@hongpung/src/entities/banner";

export const BannerTabView: React.FC = () => {
  const { data: banners, isLoading } = useLoadBannersFetch();
  const [viewingPart, setViewingPart] = useState<"PROMOTION" | "EVENT">(
    "PROMOTION",
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: "#FFF",
        }}
      >
        <Pressable
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            backgroundColor:
              viewingPart === "PROMOTION" ? "#FFF" : Color["grey200"],
          }}
          onPress={() => setViewingPart("EVENT")}
        >
          <View
            style={[
              {
                display: "flex",
                alignItems: "center",
                backgroundColor:
                  viewingPart === "EVENT" ? "#FFF" : Color["grey200"],
                justifyContent: "center",
                paddingVertical: 16,
              },
              viewingPart === "EVENT"
                ? { borderTopRightRadius: 10, borderTopLeftRadius: 10 }
                : { borderBottomRightRadius: 10 },
            ]}
          >
            <Text
              style={{ fontSize: 16, fontFamily: "NanumSquareNeo-Regular" }}
            >
              이벤트
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            backgroundColor:
              viewingPart === "EVENT" ? "#FFF" : Color["grey200"],
          }}
          onPress={() => setViewingPart("PROMOTION")}
        >
          <View
            style={[
              {
                display: "flex",
                alignItems: "center",
                backgroundColor:
                  viewingPart === "PROMOTION" ? "#FFF" : Color["grey200"],
                justifyContent: "center",
                paddingVertical: 16,
              },
              viewingPart === "PROMOTION"
                ? { borderTopLeftRadius: 10, borderTopRightRadius: 10 }
                : { borderBottomLeftRadius: 10 },
            ]}
          >
            <Text
              style={{ fontSize: 16, fontFamily: "NanumSquareNeo-Regular" }}
            >
              홍보
            </Text>
          </View>
        </Pressable>
      </View>
      <View
        style={{
          display: "flex",
          flex: 1,
          backgroundColor: "#FFF",
          paddingVertical: 12,
        }}
      >
        <FlatList
          contentContainerStyle={{ marginHorizontal: 16, gap: 12, flexGrow: 1 }}
          data={banners?.filter((banner) => banner.tag === viewingPart)}
          renderItem={({ item }) => (
            <BannerItem
              key={item.bannerId}
              banner={item}
              onBannerPress={() => {}}
            />
          )}
          initialNumToRender={8} // 초기 렌더링할 아이템 개수
          windowSize={6} // 렌더링 영역의 아이템 개수
          ListEmptyComponent={
            isLoading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color={Color["grey300"]} />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "NanumSquareNeo-Regular",
                    color: Color["grey300"],
                  }}
                >
                  배너가 없습니다.
                </Text>
              </View>
            )
          }
        />
      </View>
    </View>
  );
};
