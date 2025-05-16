import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import NoticeList from "@hongpung/src/widgets/notice/ui/NoticeList/NoticeList";
import { Color, Header } from "@hongpung/src/common";
import { NoticeStackProps } from "@hongpung/src/common/navigation/noticeStack";

const NoticeListPage: React.FC<NoticeStackProps<"NoticeList">> = ({
  navigation,
}) => {
  const handleNoticePress = (noticeId: number) => {
    navigation.navigate("NoticeDetail", { noticeId });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header leftButton={"arrow-back"} headerName="공지사항" />
      <View style={styles.container}>
        <NoticeList onNoticePress={handleNoticePress} />
      </View>
    </View>
  );
};

export default NoticeListPage;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
