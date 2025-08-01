import { View, Text, StyleSheet } from "react-native";

import { Color } from "@hongpung/src/common";
import { useLoadNoticeDetailFetch } from "@hongpung/src/entities/notice";
import { NoticeDetailSekeleton } from "../NoticeSekeleton/NoticeDetailSekeleton";

interface NoticeDetailProps {
  noticeId: number;
}

const NoticeDetail: React.FC<NoticeDetailProps> = ({ noticeId }) => {
  const { data, isLoading } = useLoadNoticeDetailFetch({ noticeId });
  if (isLoading) {
    return <NoticeDetailSekeleton />;
  }

  return (
    <View style={styles.contentContainer}>
      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>{data?.title}</Text>
        <Text style={styles.noticeDate}>
          {data?.createdAt.split("T")[0]}{" "}
          {data?.createdAt.split("T")[1].slice(0, 2)}시
          {data?.createdAt.split("T")[1].slice(3, 5)}분
        </Text>
        <View style={styles.separator} />
        <Text style={styles.noticeContent}>{data?.content}</Text>
      </View>
    </View>
  );
};

export default NoticeDetail;

const styles = StyleSheet.create({
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
