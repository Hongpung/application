import React from "react";
import { FlatList, View, Text, Pressable, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SessionCardComponent } from "./SessionCardComponent";
import { BlankCardComponent } from "./BlankCardComponent";
import { useSessionListCards } from "../hooks/useSessionListCards";
import { ReservationCard, Session } from "../types";
import { Color } from "@hongpung/ColorSet";

const { width } = Dimensions.get("window");

const SessionListCards: React.FC<{ sessionList: Session[] }> = ({ sessionList }) => {
  const navigation = useNavigation();
  const { isOnAir, reservationCards, cardViewRef } = useSessionListCards(sessionList);

  return (
    <View style={{ flexDirection: "column", gap: 12 }}>
      {sessionList?.length === 0 ? (
        <View style={{ alignSelf: "center", height: 200, borderWidth: 1, borderColor: Color["grey200"], borderRadius: 10, marginHorizontal: 6, width: width - 48, gap: 8, justifyContent: "center" }}>
          <Text style={{ fontFamily: "NanumSquareNeo-Bold", marginHorizontal: 64, color: Color["grey700"], textAlign: "center", fontSize: 16 }}>
            {`오늘 예정된 예약이 없어요`}
          </Text>
          <Text style={{ fontFamily: "NanumSquareNeo-Light", color: Color["grey500"], textAlign: "center" }}>{`지금 연습실에 가면 바로 이용이 가능해요!`}</Text>
          <View style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Pressable
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 8,
                paddingHorizontal: 12,
                marginHorizontal: 60,
                borderWidth: 1,
                borderColor: Color["grey200"],
                borderRadius: 25,
              }}
              onPress={() => navigation.jumpTo("QRScan")}
            >
              <Text numberOfLines={1} style={{ color: Color["grey400"], fontFamily: "NanumSquareNeo-Regular", textAlign: "left", fontSize: 14 }}>
                QR 스캔해서 사용하기
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <FlatList
          ref={cardViewRef}
          contentContainerStyle={{ position: "relative", alignItems: "center" }}
          data={reservationCards}
          horizontal
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => ((item?.type === "session" && item.session.sessionType === "RESERVED" && item.session.title) || "false") + index}
          snapToAlignment="start"
          snapToInterval={width - 36}
          decelerationRate="fast"
          renderItem={({ item }: { item: ReservationCard }) => {
            if (item.type === "blank") {
              if (isOnAir) return null;
              return <BlankCardComponent nextReservationTime={item.nextReservationTime} />;
            }
            return <SessionCardComponent session={item.session} />;
          }}
          ListHeaderComponent={() => <View style={{ width: 24 }} />}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          ListFooterComponent={() => <View style={{ width: 24 }} />}
        />
      )}
    </View>
  );
};

export default SessionListCards;
