import { ScrollView, View, StyleSheet, Alert } from "react-native";
import React from "react";
import { Color, Header } from "@hongpung/src/common";
import { ClubProfileSection } from "@hongpung/src/widgets/club/ui/ClubProfileSection/ClubProfileSection";
import { ClubMenuSection } from "@hongpung/src/widgets/club/ui/ClubMenuSection/ClubMenuSection";
import { ClubFooterSection } from "@hongpung/src/widgets/club/ui/ClubFooterSection/ClubFooterSection";
import { useLoadClubInfoFetch } from "@hongpung/src/entities/club/api/clubApi";
import { UserStatusState } from "@hongpung/src/entities/member";
import { useAtomValue } from "jotai";
import {
  ClubStackProps,
} from "@hongpung/src/common/navigation";
import { ClubParamList } from "@hongpung/src/common/navigation";

const ClubMainPage: React.FC<ClubStackProps<"ClubMain">> = ({ navigation }) => {
  const { data, isLoading, error } = useLoadClubInfoFetch();
  const loginUser = useAtomValue(UserStatusState);

  const handleMenuPress = (link: keyof ClubParamList) => {
    navigation.push("Club", { screen: link });
  };

  const handleFooterPress = () => {
    // navigation.navigate("Club", { screen: "ClubInstruments" });
  };

  if (loginUser?.club === "기타") {
    Alert.alert(
      "오류",
      "잘못된 접근입니다.\n동아리원에게만 지원하는 페이지예요.",
      [{ onPress: () => navigation.goBack() }]
    );
    return <View></View>;
  }

  if (error) {
    Alert.alert(
      "오류",
      "오류가 발생했어요.\n다시 시도해주세요.\n" + error.message,
      [{ onPress: () => navigation.goBack() }]
    );
    return <View></View>;
  }

  return (
    <View style={styles.container}>
      <Header leftButton="close" headerName="동아리 홈" />
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {isLoading && data !== null ? (
            <ClubProfileSection
              isLoading={true}
              profileImageUrl={null}
              clubName={loginUser?.club}
              roleData={null}
            />
          ) : (
            <ClubProfileSection
              isLoading={false}
              clubName={loginUser!.club as Exclude<ClubName, "기타">}
              {...data!}
            />
          )}
          <ClubMenuSection onMenuPress={handleMenuPress} />
        </View>
        <ClubFooterSection onPress={handleFooterPress} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color["grey100"],
  },
  scrollContent: {
    position: "relative",
    backgroundColor: Color["grey200"],
    flex: 1,
  },
  content: {
    backgroundColor: "#FFF",
  },
});

export default ClubMainPage;
