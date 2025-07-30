import { View, StyleSheet } from "react-native";

import { Header, Color } from "@hongpung/src/common";
import { NoticeStackProps } from "@hongpung/src/common/navigation";

import NoticeDetail from "@hongpung/src/widgets/notice/ui/NoticeDetail/NoticeDetail";

const NoticeDetailPage: React.FC<NoticeStackProps<"NoticeDetail">> = ({
  route,
}) => {
  const { noticeId } = route.params;

  return (
    <View style={styles.container}>
      <Header LeftButton={"arrow-back"} headerName="공지사항" />
      <NoticeDetail noticeId={noticeId} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  contentContainer: {
    display: "flex",
    flex: 1,
    backgroundColor: Color["grey100"],
  },
  noticeCard: {
    flex: 1,
    display: "flex",
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
  },
  noticeTitle: {
    marginHorizontal: 4,
    fontSize: 24,
    fontFamily: "NanumSquareNeo-Bold",
    marginBottom: 4,
  },
  noticeDate: {
    alignSelf: "flex-end",
    marginHorizontal: 4,
    fontSize: 12,
    fontFamily: "NanumSquareNeo-Light",
    color: Color["grey400"],
  },
  separator: {
    marginVertical: 12,
    borderWidth: 0.25,
    borderColor: Color["grey200"],
  },
  noticeContent: {
    marginHorizontal: 4,
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
  },
});

export default NoticeDetailPage;
