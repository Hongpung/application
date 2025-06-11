import { View, Text, StyleSheet } from "react-native";
import { Color, Icons } from "@hongpung/src/common";

export const ClubFooterSection: React.FC = () => {
  return (
    <View style={{ backgroundColor: "#FFF" }}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icons
            name="alert-circle-outline"
            size={16}
            color={Color["grey300"]}
          />
          <Text style={styles.text}>
            동아리 정보 변경은 의장에게 문의하세요
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color["grey100"],
    alignItems: "center",
    paddingVertical: 32,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  text: {
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey300"],
    fontSize: 14,
  },
});
