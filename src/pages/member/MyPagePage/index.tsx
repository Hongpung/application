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
import { Header } from "@hongpung/src/common";

const MyPageScreen: React.FC<MainTabScreenProps<"MyPage">> = ({
  navigation,
}) => {
  const loginUser = useAtomValue(UserStatusState);

  if (!loginUser) {
    return <View />;
  }

  const handleMenuPress = (link: keyof MainStackParamList) => {
    navigation.push(link);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header headerName="내 정보" leftButton={null} />
      <ScrollView style={{ flex: 1 }} bounces={false}>
        <View style={styles.container}>
          <ProfileBox member={loginUser} />

          <MyActivitiesSection onPress={handleMenuPress} />
          <SettingsSection onPress={handleMenuPress} />
        </View>

        <FooterSection
          onPressChangeInfo={() => {
            // handleMenuPress("ChangeMyInfo");
          }}
          onPressChangePassword={() => handleMenuPress("ChangePassword")}
          onPressWithdrawal={() => {
            // handleMenuPress("WithdrawalAuth");
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
