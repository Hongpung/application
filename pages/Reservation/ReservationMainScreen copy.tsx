import React from "react";
import { View, Image, Text, Dimensions } from "react-native";
import SessionListCards from "./components/SessionListCards";
import useSessionListSocket from "./hooks/useSessionListSocket";
import { Color } from "@hongpung/ColorSet";

const { height } = Dimensions.get("window");

const ReservationMainScreen: React.FC = () => {
  const sessionList = useSessionListSocket();

  

  return (
    <View style={{ backgroundColor: "#FFF", flex: 1, flexDirection: "column", paddingTop: height / 4 }}>
      <SessionListCards sessionList={sessionList} />
      <View style={{ position: "absolute", bottom: 92, width: "100%", paddingHorizontal: 24 }}>
        <Image source={require("@hongpung/assets/icons/ReservationIcon.png")} style={{ position: "absolute", width: 120, height: 120, right: 24, bottom: -4 }} />
        <View style={{ borderWidth: 1, borderColor: Color["grey200"], borderRadius: 10, height: 88, backgroundColor: "#FFF" }}>
          <Text style={{ position: "absolute", left: 8, bottom: 8, fontSize: 16, fontFamily: "NanumSquareNeo-Heavy", color: Color["grey700"] }}>연습실 예약</Text>
        </View>
      </View>
    </View>
  );
};

export default ReservationMainScreen;