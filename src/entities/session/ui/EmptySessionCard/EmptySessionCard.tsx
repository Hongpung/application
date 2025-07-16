import { Color, Icons } from "@hongpung/src/common";
import React from "react";
import { Pressable, View, Text, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
interface EmptySessionCardProps {
  nextReservationTime: string;
  toNavigateQRScan: () => void;
}

const EmptySessionCard: React.FC<EmptySessionCardProps> = ({
  nextReservationTime,
  toNavigateQRScan,
}) => {
  return (
    <View style={styles.container}>
      <Text numberOfLines={1} style={styles.title}>
        즉시 이용 가능해요
      </Text>

      <View style={styles.qrButtonContainer}>
        <Pressable style={styles.qrButton} onPress={toNavigateQRScan}>
          <Text numberOfLines={1} style={styles.qrButtonText}>
            QR 스캔해서 사용하기
          </Text>
          <Icons
            name="chevron-forward"
            size={20}
            color={Color["grey300"]}
            style={styles.qrButtonIcon}
          />
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          다음 연습 시간: {nextReservationTime}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    height: 200,
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderColor: Color["grey200"],
    borderRadius: 10,
    width: width - 48,
  },
  title: {
    fontFamily: "NanumSquareNeo-Bold",
    marginHorizontal: 64,
    top: 72,
    textAlign: "center",
    fontSize: 20,
  },
  qrButtonContainer: {
    top: 80,
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  qrButton: {
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
  },
  qrButtonText: {
    color: Color["grey400"],
    fontFamily: "NanumSquareNeo-Regular",
    textAlign: "left",
    fontSize: 14,
  },
  qrButtonIcon: {
    marginRight: -8,
  },
  footer: {
    position: "absolute",
    right: 24,
    bottom: 24,
    alignItems: "flex-end",
  },
  footerText: {
    textAlign: "right",
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
    color: Color["grey400"],
  },
});

export default React.memo(EmptySessionCard);
