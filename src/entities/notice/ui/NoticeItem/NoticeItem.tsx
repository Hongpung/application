import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Color } from "@hongpung/src/common";
import { BriefNotice } from "../../model/type";

interface NoticeItemProps {
  notice: BriefNotice;
  onNoticePress: (noticeId: number) => void;
}

const NoticeItem: React.FC<NoticeItemProps> = ({ notice, onNoticePress }) => {
  const { noticeId, title, createdAt } = notice;
  return (
    <TouchableOpacity
      key={noticeId}
      style={styles.container}
      onPress={() => onNoticePress(noticeId)}
    >
      <Text numberOfLines={1} style={styles.title}>{title}</Text>
      <Text style={styles.date}>{createdAt.split("T")[0]}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Color["grey200"],
  },
  title: {
    fontSize: 18,
    color: Color["grey400"],
  },
  date: {
    fontSize: 14,
    color: Color["grey300"],
  },
});

export default NoticeItem;
