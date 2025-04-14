import { View, Text, Pressable, StyleSheet } from "react-native";
import { Color } from "@hongpung/src/common";

interface ClubFooterSectionProps {
  onPress: () => void;
}

export const ClubFooterSection: React.FC<ClubFooterSectionProps> = ({
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.text}>동아리 정보 변경을 원하시나요?</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color["grey200"],
    alignItems: "center",
    paddingVertical: 32,
  },
  button: {
    paddingBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: Color["grey300"],
    alignItems: "center",
  },
  text: {
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey400"],
    textAlign: "center",
  },
}); 