import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import NoticeList from "@hongpung/src/widgets/notice/ui/NoticeList/NoticeList";
import { Color, Header } from "@hongpung/src/common";
import { useLoadNoticeListFetch } from "@hongpung/src/entities/notice/api/noticeApi";
import { ScrollView } from "react-native-gesture-handler";

const NoticeListPage: React.FC<MainStackProps<"NoticeStack">> = ({
  navigation,
}) => {
  const { data, isLoading } = useLoadNoticeListFetch();

  const handleNoticePress = (noticeId: number) => {
    navigation.navigate("NoticeDetail", { noticeId });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header leftButton={"arrow-back"} headerName="공지사항" />
      {isLoading ? (
        <ActivityIndicator color={Color["blue500"]} size={"large"} />
      ) : (
        <ScrollView contentContainerStyle={styles.container} bounces={false}>
          <View style={styles.styleBoard}>
            {data && data.length > 0 ? (
              <NoticeList notices={data} onNoticePress={handleNoticePress} />
            ) : (
              <Text style={styles.noNoticesText}>공지 사항이 없습니다.</Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default NoticeListPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color["grey100"],
    padding: 16,
    position: "relative",
  },
  styleBoard: {
    height: "100%",
    width: "100%",
    backgroundColor: "#FFF",
    padding: 16,
  },
  noNoticesText: {
    fontSize: 16,
    color: Color["grey400"],
    textAlign: "center",
  },
});
