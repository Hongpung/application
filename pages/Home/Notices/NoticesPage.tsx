import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import useFetchUsingToken from '@hongpung/hoc/useFetchUsingToken'
import { Color } from '@hongpung/ColorSet'

interface BriefNotice {
    infoId: number
    title: string
    date: string//dateString
}


const NoticesPage: React.FC<{ navigation: any }> = ({ navigation }) => {

    const today = new Date().toISOString().split('T')[0]
    const { data, error, loading } = useFetchUsingToken<BriefNotice[]>(`${process.env.BASE_URL}/info`)

    return (
        <View style={{ display: 'flex', flex: 1, backgroundColor: Color['grey100'], flexDirection: 'column', paddingTop: 24, paddingBottom: 16 }}>
            <View style={{ display: 'flex', flex: 1, backgroundColor: '#fff', marginHorizontal: 12, paddingHorizontal: 16, paddingVertical: 20, gap: 24, borderRadius: 24, flexDirection: 'column' }}>
                {loading ?
                    <ActivityIndicator style={{ alignSelf: 'center' }} />
                    :
                    data && data?.length > 0 ?
                        data.slice(0, 10).map((notice) => (
                            <TouchableOpacity style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}
                                onPress={() => { navigation.navigate('NoticeDetail', { infoId: notice.infoId }) }}>
                                {today == notice.date.split('T')[0] &&
                                    <View style={{ paddingHorizontal: 4, paddingVertical: 2, backgroundColor: Color['red100'], borderRadius: 4 }}>
                                        <Text style={{ fontSize: 12, fontFamily: 'NanumSquareNeo-Regular', color: Color['red400'] }}>new</Text>
                                    </View>
                                }
                                <Text numberOfLines={2} ellipsizeMode='tail' style={{ flex: 1, fontSize: 18, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>
                                    [공지사항] {notice.title}
                                </Text>
                                <Text style={{ fontSize: 14, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>{notice.date.split('T')[0]}</Text>
                            </TouchableOpacity>
                        )) :
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', color: Color['grey400'] }}>공지 사항이 없습니다.</Text>
                }
            </View>
            <View style={{ display: 'flex', gap: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                {/* {[1, 2, 3, 4, 5,].map(page => (<Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', }}>{page}</Text>))} */}
            </View>
        </View>
    )
}

export default NoticesPage