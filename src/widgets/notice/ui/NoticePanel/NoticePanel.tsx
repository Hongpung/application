import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { Color, Icons } from "@hongpung/src/common";

import { useNoticePanel } from "../../model/useNoticePanel";
import { NoticeItem } from "@hongpung/src/entities/notice";
import { Skeleton } from "moti/skeleton";

type NoticePanelProps = {
  navigateToNoticeDetail: (noticeId: number) => void;
  navigateToNoticeList: () => void;
};

export const NoticePanel: React.FC<NoticePanelProps> = (props) => {
  const { navigateToNoticeDetail, navigateToNoticeList } = props;
  
  const { noticeList = [], isLoading } = useNoticePanel();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Icons name="megaphone" size={16} color={Color["grey400"]} />
          <Text style={styles.title}>공지사항</Text>
        </View>
        <Pressable style={styles.moreButton} onPress={navigateToNoticeList}>
          <Text style={styles.moreText}>더 보기</Text>
          <Icons name="add" size={16} color={Color["grey300"]} />
        </Pressable>
      </View>
      {isLoading ? (
        <View style={[styles.noticeList, { gap: 8 }]}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              transition={{
                type: "spring",
                duration: 400,
                delay: 100,
              }}
              width="100%"
              height={28}
              radius={50}
              colors={[Color["grey100"], Color["grey300"]]}
            />
          ))}
        </View>
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
        </View>
      )}
    </View>
  );
};

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
    justifyContent: "space-between",
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: "NanumSquareNeo-Bold",
    height: 20,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  moreText: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey300"],
  },
});
