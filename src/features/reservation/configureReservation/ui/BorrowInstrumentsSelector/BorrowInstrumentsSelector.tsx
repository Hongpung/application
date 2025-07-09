import { View, Text, Pressable } from "react-native";

import { Color, Icons } from "@hongpung/src/common";

import { BorrowInstrumentsViewer } from "@hongpung/src/entities/reservation";
import React from "react";

type BorrowInstrumentSelectorProps = {
  resetBorrowInstruments: () => void;
  borrowInstruments: any[];
  onPress: () => void;
};

const BorrowInstrumentsSelector: React.FC<BorrowInstrumentSelectorProps> = ({
  onPress,
  resetBorrowInstruments,
  borrowInstruments,
}) => {
  return (
    <View>
      <View style={{ marginHorizontal: 24 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "NanumSquareNeo-Regular",
              color: Color["grey500"],
            }}
          >
            대여 악기
          </Text>
          <Pressable
            style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
            onPress={resetBorrowInstruments}
          >
            <Icons name="refresh" size={16} color={Color["grey400"]} />
            <Text
              style={{
                fontSize: 12,
                fontFamily: "NanumSquareNeo-Regular",
                color: Color["grey300"],
              }}
            >
              초기화
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 16 }} />

        <Pressable style={{ marginHorizontal: 16 }} onPress={onPress}>
          {borrowInstruments.length > 0 ? (
            <BorrowInstrumentsViewer borrowInstruments={borrowInstruments} />
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 8,
                borderRadius: 10,
                borderWidth: 4,
                height: 72,
                borderColor: Color["grey200"],
                borderStyle: "dashed",
              }}
            >
              <Icons name="add" size={24} color={Color["grey300"]} />
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "NanumSquareNeo-Bold",
                  color: Color["grey300"],
                }}
              >
                대여 악기 추가하기
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default React.memo(BorrowInstrumentsSelector);
