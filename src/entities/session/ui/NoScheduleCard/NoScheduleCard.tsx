import { Color, Icons } from "@hongpung/src/common";
import { View, Text, Pressable, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

type NoScheduleCardProps = {
  toNavigateQRScan: () => void;
};

const NoScheduleCard: React.FC<NoScheduleCardProps> = ({
  toNavigateQRScan,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{`오늘 예정된 예약이 없어요`}</Text>
        <Text style={styles.descriptionText}>
          {`지금 연습실에 가면 바로 이용이 가능해요!`}
        </Text>
      </View>
      <View style={styles.pressableContainer}>
        <Pressable style={styles.pressableButton} onPress={toNavigateQRScan}>
          <Text numberOfLines={1} style={styles.pressableButtonText}>
            QR 스캔해서 사용하기
          </Text>
          <Icons
            name="chevron-forward"
            size={20}
            color={Color["grey300"]}
            style={{ marginRight: -8 }}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default NoScheduleCard;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    height: 200,
    borderWidth: 1,
    borderColor: Color["grey200"],
    borderRadius: 10,
    marginHorizontal: 6,
    width: width - 48,
    gap: 16,
    justifyContent: "center",
  },
  contentContainer: {
    gap: 8,
  },
  titleText: {
    fontFamily: "NanumSquareNeo-Bold",
    marginHorizontal: 64,
    color: Color["grey700"],
    textAlign: "center",
    fontSize: 16,
  },
  descriptionText: {
    fontFamily: "NanumSquareNeo-Light",
    color: Color["grey500"],
    textAlign: "center",
  },
  pressableContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  pressableButton: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Color["grey200"],
    borderRadius: 25,
  },
  pressableButtonText: {
    color: Color["grey400"],
    fontFamily: "NanumSquareNeo-Regular",
    textAlign: "left",
    fontSize: 14,
  },
});
