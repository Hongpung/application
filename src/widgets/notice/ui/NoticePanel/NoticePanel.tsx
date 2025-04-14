import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import React from "react";
import { Color } from "@hongpung/ColorSet";
import { Icons } from "@hongpung/src/common";
import { BriefNotice } from "@hongpung/src/entities/notice/model/type";
import NoticeItem from "@hongpung/src/entities/notice/ui/NoticeItem/NoticeItem";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

type NoticePanelProps = {
  noticeList: BriefNotice[];
  isLoading: boolean;
  navigateToNoticeDetail: (noticeId: number) => void;
  navigateToNoticeList: () => void;
};

const NoticePanel: React.FC<NoticePanelProps> = (props) => {
  const {
    noticeList,
    isLoading,
    navigateToNoticeDetail,
    navigateToNoticeList,
  } = props;

  if (isLoading) {
    return (
      <View>
        <Text style={styles.title}>공지사항</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icons name="megaphone" size={16} color={Color["grey400"]} />
        <Text style={styles.title}>공지사항</Text>
      </View>
      {isLoading ? (
        <SkeletonPlaceholder>
          <View style={{ width: "100%", height: 84, padding: 16, }}></View>
        </SkeletonPlaceholder>
      ) : (
        <View style={styles.noticeList}>
          {noticeList && noticeList.length > 0 ? (
            noticeList
              .slice(0, 4)
              .map((notice) => (
                <NoticeItem
                  key={notice.noticeId}
                  notice={notice}
                  onNoticePress={navigateToNoticeDetail}
                />
              ))
          ) : (
            <View style={styles.noNotice}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.noticeText}
              >
                공지 사항이 없습니다.
              </Text>
            </View>
          )}
          {noticeList && noticeList.length > 4 && (
            <Pressable
              style={styles.moreButton}
              onPress={() => {
                navigateToNoticeList();
              }}
            >
              <Text style={styles.moreText}>더 보기</Text>
              <Icons
                name="chevron-forward"
                size={18}
                color={Color["grey400"]}
              />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

export default NoticePanel;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 14,
    width: "100%",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: "NanumSquareNeo-Bold",
    height: 20,
  },
  noticeList: {
    display: "flex",
    gap: 16,
    width: "100%",
    flexDirection: "column",
  },
  noticeItem: {
    display: "flex",
    alignItems: "center",
    marginHorizontal: 12,
    flexDirection: "row",
    gap: 2,
  },
  noticeText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey400"],
  },
  dateText: {
    fontSize: 12,
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey400"],
  },
  noNotice: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Color["grey100"],
    borderRadius: 60,
  },
  moreButton: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 4,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Color["grey400"],
  },
  moreText: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey400"],
  },
});
