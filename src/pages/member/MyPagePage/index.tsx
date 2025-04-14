import { ScrollView, View, StyleSheet } from "react-native";
import React from "react";
import { useRecoilValue } from "recoil";
import { UserStatusState } from "@hongpung/src/entities/member";
import { ProfileBox } from "@hongpung/src/entities/member/ui/ProfileBox/ProfileBox";

import { MyActivitiesSection } from "@hongpung/src/widgets/member/ui/MyActivitiesSection/MyActivitiesSection";
import { SettingsSection } from "@hongpung/src/widgets/member/ui/SettingsSection/SettingsSection";
import { FooterSection } from "@hongpung/src/widgets/member/ui/FooterSection/FooterSection";

const MyPageScreen: React.FC<MainStackProps<"BottomTab">> = ({ navigation }) => {

  const loginUser = useRecoilValue(UserStatusState);

  if (!loginUser) {
    return <View />;
  }

  const handleMenuPress = (link: string) => {
    navigation.push("MyPage", { screen: link });
  };

  return (
    <ScrollView bounces={false}>
      <View style={styles.container}>
        <View>
          <ProfileBox member={loginUser} />
        </View>

        <MyActivitiesSection onPress={handleMenuPress} />

        <SettingsSection onPress={handleMenuPress} />
      </View>

      <FooterSection
        onPressChangeInfo={() => handleMenuPress("ChangeMyInfo")}
        onPressChangePassword={() => handleMenuPress("ChangePassword")}
        onPressWithdrawal={() => handleMenuPress("WithdrawalAuth")}
      />
    </ScrollView>
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
