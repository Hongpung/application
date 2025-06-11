import { ScrollView, View, StyleSheet } from "react-native";
import React from "react";
import { useAtomValue } from "jotai";
import { UserStatusState } from "@hongpung/src/entities/member";
import { ProfileBox } from "@hongpung/src/entities/member/ui/ProfileBox/ProfileBox";

import { MyActivitiesSection } from "@hongpung/src/widgets/member/ui/MyActivitiesSection/MyActivitiesSection";
import { SettingsSection } from "@hongpung/src/widgets/member/ui/SettingsSection/SettingsSection";
import { FooterSection } from "@hongpung/src/widgets/member/ui/FooterSection/FooterSection";
import {
  MainTabScreenProps,
  MainStackParamList,
} from "@hongpung/src/common/navigation";
import { Header, Alert } from "@hongpung/src/common";
import { debounce } from "lodash";
import { StackActions } from "@react-navigation/native";

const MyPageScreen: React.FC<MainTabScreenProps<"MyPage">> = ({
  navigation,
}) => {
  const loginUser = useAtomValue(UserStatusState);
  console.log(loginUser);
  const handleMenuPress = debounce(
    (link: keyof MainStackParamList) => {
      navigation.push(link);
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );
  const handleNoUser = () => {
    Alert.alert("세션 만료", "다시 로그인 해주세요.", {
      confirmText: "확인",
      onConfirm: () => {
        navigation.dispatch(StackActions.replace("LoginStack"));
      },
      cancelable: false,
    });
  };

  if (!loginUser) {
    handleNoUser();
    return <View />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header headerName="내 정보" LeftButton={null} />
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <ProfileBox member={loginUser} />

          <MyActivitiesSection onPress={handleMenuPress} />
          <SettingsSection onPress={handleMenuPress} />
        </View>

        <FooterSection
          onPressChangeInfo={() => {
            handleMenuPress("ChangeProfile");
          }}
          onPressChangePassword={() => handleMenuPress("ChangePassword")}
          onPressWithdrawal={() => {
            handleMenuPress("Withdraw");
          }}
        />
      </ScrollView>
    </View>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flexDirection: "column",
    gap: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
});
