import { ActivityIndicator, TouchableOpacity, Text, View, Pressable } from 'react-native'
import React from 'react'
import useFetchUsingToken from '@hongpung/src/common/hooks/useFetchUsingToken'
import { Color } from '@hongpung/ColorSet'
import { Icons } from '../../src/common/components/icons/Icon'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainStackParamList, NoticeStackParamList } from '@hongpung/nav/HomeStacks'


interface BriefNotice {
    noticeId: number
    title: string
    createdAt: string//dateString
    updatedAt: string//dateString
}

type CombinedNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<MainStackParamList, 'NoticeStack'>,
    NativeStackNavigationProp<NoticeStackParamList, 'NoticeDetail'>
>;

const NoticePartition: React.FC = () => {

    const navigation = useNavigation<CombinedNavigationProp>();
    const { data, error, loading } = useFetchUsingToken<BriefNotice[]>(`${process.env.EXPO_BASE_URL}/notice`)

    if (loading)
        return (<>
            <ActivityIndicator color={'white'} size={'large'} />
        </>)

    return (
        <View style={{ display: 'flex', gap: 14, width: '100%', flexDirection: 'column' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icons name='megaphone' size={16} color={Color['grey400']} />
                <Text style={{ fontSize: 18, fontFamily: 'NanumSquareNeo-Bold', height: 20 }}>공지사항</Text>
            </View>
            <View style={{ display: 'flex', gap: 16, width: '100%', flexDirection: 'column' }}>
                {data && data?.length > 0 ?
                    data.slice(0, 4).map((notice) => (
                        <TouchableOpacity key={notice.noticeId} style={{ display: 'flex', alignItems: 'center', marginHorizontal: 12, flexDirection: 'row', gap: 2 }}
                            onPress={() => {
                                navigation.setOptions({
                                    animation: 'none', // 애니메이션 끄기
                                });
                                navigation.push('NoticeStack');
                                navigation.setOptions({
                                    animation: 'slide_from_right', // 애니메이션 끄기
                                });
                                navigation.push('NoticeStack', { screen: 'NoticeDetail', params: { noticeId: notice.noticeId } })
                            }}>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ flex: 1, fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>
                                [공지사항] {notice.title}
                            </Text>
                            <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>{notice.createdAt.split('T')[0]}</Text>
                        </TouchableOpacity>
                    )) :
                    <View style={{ paddingHorizontal: 12, paddingVertical:12, backgroundColor:Color['grey100'], borderRadius:60}}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>
                            공지 사항이 없습니다.
                        </Text>
                    </View>


                }
                {data && data?.length > 4
                    &&
                    <Pressable style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', gap: 4, alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 50, borderWidth: 1, borderColor: Color['grey400'] }}
                        onPress={() => { navigation.navigate('NoticeStack') }}>
                        <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>
                            더 보기
                        </Text>
                        <Icons name='chevron-forward' size={18} color={Color['grey400']} />
                    </Pressable>
                }
            </View>
        </View >
    )
}

export default NoticePartition
