import { useState, useEffect, useCallback } from 'react';
import { useSearchInvitePossibleMembersFetch } from '../api/searchInvitePossibleMembersApi';
import { Member } from '@hongpung/src/entities/member';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { throttle } from 'lodash';


type FindOptions = {
    clubId: number[];
    keyword: string;
};

export const useInvitePossibleMemberData = (searchParams: FindOptions) => {

    const navigation = useNavigation()

    const [data, setData] = useState<Member[]>([]);
    const [page, setPage] = useState(0);
    const [isLast, setIsLast] = useState(false);

    const { isLoading, error, data: fetchData } = useSearchInvitePossibleMembersFetch({ page, ...searchParams });

    useEffect(() => {
        if (fetchData) {
            setData(prev => ([...prev, ...fetchData]))
            if (fetchData.length < 10) {
                setIsLast(true)
            }
        } else {
            Alert.alert('오류', '오류가 발생했어요.\n다시 시도해주세요.');
            const isCanGoBack = navigation.canGoBack();
            if (isCanGoBack) {
                navigation.goBack();
            }
        }
    }, [fetchData]);

    useEffect(() => {
        setPage(0)
    }, [searchParams]);

    const loadNewPage = useCallback(throttle(() => {
        if (isLast) { return; }

        if (!isLoading) {
            setPage(prev => prev + 1)
        }
    }, 1000), [setPage, isLoading])

    return { data, isLoading, error, loadNewPage };

};