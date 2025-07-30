import { ScrollView, View, StyleSheet } from "react-native";
import React, { Suspense } from "react";
import { Alert, Color, Header } from "@hongpung/src/common";
import { ClubProfileSection } from "@hongpung/src/widgets/club/ui/ClubProfileSection/ClubProfileSection";
import { ClubMenuSection } from "@hongpung/src/widgets/club/ui/ClubMenuSection/ClubMenuSection";
import { ClubFooterSection } from "@hongpung/src/widgets/club/ui/ClubFooterSection/ClubFooterSection";
import { useLoadMyStatusFetch } from "@hongpung/src/entities/member";
import { ClubStackProps, ClubParamList } from "@hongpung/src/common/navigation";
import { debounce } from "lodash";
import { ClubProfileSectionSkeleton } from "@hongpung/src/widgets/club/ui/ClubProfileSection/ClubProfileSectionSkeleton";

const ClubMainPage: React.FC<ClubStackProps<"ClubMain">> = ({ navigation }) => {
  const { data: loginUser } = useLoadMyStatusFetch();

  const handleMenuPress = debounce(
    (link: keyof ClubParamList) => {
      navigation.navigate("Club", { screen: link });
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );

  const debouncedGoBack = debounce(
    () => {
      navigation.goBack();
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );

  if (loginUser?.club === "기타") {
    Alert.alert(
      "오류",
      "잘못된 접근입니다.\n동아리원에게만 지원하는 페이지예요.",
      { onConfirm: debouncedGoBack },
    );
    return <View></View>;
  }

  return (
    <View style={styles.container}>
      <Header LeftButton="close" headerName="동아리 홈" />
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Suspense fallback={<ClubProfileSectionSkeleton />}>
            <ClubProfileSection />
          </Suspense>

          <ClubMenuSection onMenuPress={handleMenuPress} />
        </View>
        <ClubFooterSection />
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
    backgroundColor: Color["grey100"],
    flex: 1,
  },
  content: {
    backgroundColor: "#FFF",
  },
});

export default ClubMainPage;
