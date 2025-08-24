import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Color, Header, Switch } from "@hongpung/src/common";
import { FullScreenLoadingModal } from "@hongpung/src/common/ui/LoadingModal/FullScreenLoadingModal";
import { LogoutButton } from "@hongpung/src/features/auth/logout/ui/LogoutButton/LogoutButton";
import useLogout from "@hongpung/src/features/auth/logout/model/useLogout";
import useAutoLogin from "@hongpung/src/features/auth/setAutoLogin/model/useAutoLogin";

export const LoginSettingPage: React.FC = () => {
  const [autoLogin, setAutoLogin] = useAutoLogin();
  const { LogOutHandler, isLoading } = useLogout();

  return (
    <View>
      <FullScreenLoadingModal isLoading={isLoading} />
      <Header headerName="로그인 설정" LeftButton="arrow-back" />
      <View style={{ height: 24 }} />
      <View style={styles.autoLoginContainer}>
        <Text style={styles.autoLoginText}>자동 로그인 설정</Text>
        <Switch onChange={setAutoLogin} value={autoLogin} />
      </View>
      <View style={{ height: 24 }} />
      <LogoutButton onPress={LogOutHandler} />
    </View>
  );
};

const styles = StyleSheet.create({
  autoLoginContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 36,
    justifyContent: "space-between",
  },
  autoLoginText: {
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey700"],
    fontSize: 16,
  },
});
