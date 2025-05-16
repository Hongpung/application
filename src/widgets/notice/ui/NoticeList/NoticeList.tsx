import React from "react";
import { FlatList, Text, StyleSheet, View } from "react-native";

import {
  NoticeItem,
  useLoadNoticeListFetch,
} from "@hongpung/src/entities/notice";
import { Color } from "@hongpung/src/common";

import { NoticeItemSkeleton } from "../NoticeSekeleton/NoticeItemSkeleton";

interface NoticeListProps {
  onNoticePress: (noticeId: number) => void;
}

const NoticeList: React.FC<NoticeListProps> = ({ onNoticePress }) => {
  const { data: notices = [], isLoading } = useLoadNoticeListFetch();

  if (isLoading) {
    return (
      <FlatList
        data={Array.from({ length: 10 })}
        bounces={false}
        style={styles.container}
        contentContainerStyle={[styles.contentContainer]}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              marginHorizontal: 16,
              backgroundColor: Color["grey200"],
            }}
          />
        )}
        keyExtractor={(_, index) => "skeleton" + index}
        renderItem={(_) => <NoticeItemSkeleton />}
      />
    );
  }
  return (
    <FlatList
      bounces={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={notices}
      renderItem={({ item }) => (
        <NoticeItem
          notice={item}
          onNoticePress={() => onNoticePress(item.noticeId)}
        />
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>공지사항이 없습니다.</Text>
        </View>
      }
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 1,
            marginHorizontal: 16,
            backgroundColor: Color["grey200"],
          }}
        />
      )}
      keyExtractor={(item) => item.noticeId.toString()}
    />
  );
};

export default NoticeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color["grey100"],
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    borderRadius: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: Color["grey400"],
    fontSize: 18,
    fontFamily: "NanumSquareNeo-Regular",
  },
});
