import { View, Text, Pressable, StyleSheet } from "react-native";
import { Alert, Color } from "@hongpung/src/common";

interface FindAccountActionsSectionProps {
  onPressResetPassword: () => void;
}

export const FindAccountActionsSection: React.FC<FindAccountActionsSectionProps> = ({
  onPressResetPassword,
}) => {
  return (
    <View style={styles.actionContainer}>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Pressable onPress={() => Alert.alert("이메일 찾기 안내",`이메일은 관리자에게 문의하여 찾을 수 있어요.\n관리자 연락처: admin@gmail.com`)}>
          <Text style={styles.actionText}>ID 찾기</Text>
        </Pressable>
      </View>
      <Pressable
        style={{ flex: 1, alignItems: "center" }}
        onPress={onPressResetPassword}
      >
        <Text style={styles.actionText}>비밀번호 재설정</Text>
      </Pressable>
    </View>
  );
};

// 스타일 추가
const styles = StyleSheet.create({
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 16,
    height: 26,
    marginHorizontal: 48,
    justifyContent: "center",
  },
  actionText: {
    width: "100%",
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "NanumSquareNeo-Bold",
    textAlign: "center",
    color: Color["grey400"],
  },
});
