import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import NoticeItem from '@hongpung/src/entities/notice/ui/NoticeItem/NoticeItem';
import { BriefNotice } from '@hongpung/src/entities/notice/model/type';

interface NoticeListProps {
    notices: BriefNotice[];
    onNoticePress: (noticeId: number) => void;
}

const NoticeList: React.FC<NoticeListProps> = ({ notices, onNoticePress }) => {
    return (
        <FlatList
            data={notices}
            renderItem={({ item }) => (
                <NoticeItem
                    notice={item}
                    onNoticePress={() => onNoticePress(item.noticeId)}
                />
            )}
            keyExtractor={(item) => item.noticeId.toString()}
        />
    );
};

export default NoticeList;
