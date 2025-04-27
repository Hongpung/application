import { View, Text, Pressable, StyleSheet } from "react-native";
import { Color } from "@hongpung/src/common";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

interface FooterSectionProps {
  onPressChangeInfo: () => void;
  onPressChangePassword: () => void;
  onPressWithdrawal: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onPressChangeInfo,
  onPressChangePassword,
  onPressWithdrawal,
}) => {
  const tabBarHeight = useBottomTabBarHeight();
  return (

    <View style={[styles.container, { paddingBottom: tabBarHeight+24 }]}>
      <Pressable
        style={styles.menuItem}
        onPress={onPressChangeInfo}
      >
        <Text style={styles.menuText}>개인 정보 수정</Text>
      </Pressable>

      <Pressable
        style={styles.menuItem}
        onPress={onPressChangePassword}
      >
        <Text style={styles.menuText}>비밀 번호 수정</Text>
      </Pressable>

      <Pressable
        style={styles.menuItem}
        onPress={onPressWithdrawal}
      >
        <Text style={styles.menuText}>회원탈퇴를 원하시나요?</Text>
      </Pressable>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    backgroundColor: Color["grey200"],
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 84,
  },
  menuItem: {
    paddingBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: Color["grey300"],
    alignItems: "center",
  },
  menuText: {
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey400"],
    textAlign: "center",
  },
}); 