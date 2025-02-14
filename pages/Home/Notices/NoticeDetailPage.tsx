import { ActivityIndicator, Text, View } from 'react-native'
import React from 'react'
import useFetchUsingToken from '@hongpung/src/common/hooks/useFetchUsingToken'
import { Color } from '@hongpung/ColorSet'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { NoticeStackParamList } from '@hongpung/nav/HomeStacks'


interface Notice {
    noticeId: number
    title: string
    content: string
    createdAt: string//dateString    
    updatedAt: string//dateString
}

type NoticeDetailProps = NativeStackScreenProps<NoticeStackParamList, 'NoticeDetail'>

const NoticeDetailPage: React.FC<NoticeDetailProps> = ({ route }) => {

    const { noticeId } = route.params;
    const { data, loading } = useFetchUsingToken<Notice>(`${process.env.EXPO_PUBLIC_BASE_URL}/notice/${noticeId}`)

    if (loading)
        return (
            <View style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={Color['blue500']} size={'large'} />
            </View>
        )

    return (
        <View style={{ display: 'flex', flex: 1, backgroundColor: Color['grey100'] }}>
            <View style={{ flex: 1, display: 'flex', marginHorizontal: 12, paddingHorizontal: 12, paddingVertical: 12, marginVertical: 16, backgroundColor: '#FFF', borderRadius: 12 }}>
                <Text textBreakStrategy='balanced' style={{ marginHorizontal: 4, fontSize: 24, fontFamily: "NanumSquareNeo-Bold", marginBottom: 4 }}>{data?.title}</Text>
                <Text style={{ alignSelf: 'flex-end', marginHorizontal: 4, fontSize: 12, fontFamily: "NanumSquareNeo-Light", color: Color['grey400'], }}>{data?.createdAt.split('T')[0]} {data?.createdAt.split('T')[1].slice(0, 2)}시{data?.createdAt.split('T')[1].slice(3, 5)}분</Text>
                <View>
                    <View style={{ marginVertical: 12, borderWidth: 0.25, borderColor: Color['grey200'] }}></View>
                </View>
                <Text textBreakStrategy='balanced' style={{ marginHorizontal: 4, fontSize: 16, fontFamily: "NanumSquareNeo-Regular", }}>{data?.content}</Text>
            </View>
        </View>
    )
}

export default NoticeDetailPage