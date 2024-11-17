import { FlatList, Pressable, StyleSheet, Text, View, Image, Linking, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Color } from '@hongpung/ColorSet'

import Banner from '@hongpung/components/home/Banner'
import { useRecoilValue } from 'recoil'
import { bannersState } from '@hongpung/recoil/bannerState'

interface BannerFetchData {
    id: string
    owner: string
    startDate: string //ISOTimeString
    endDate: string //ISOTimeString
    bannerImgUrl: string
    href?: string
}


const BannersScreen: React.FC = () => {

    const [viewingPart, setViewingPart] = useState<'EVENT' | 'PROMOTION'>('EVENT')
    const banners = useRecoilValue(bannersState);

    if (!banners.value)
        return <View><Text>Error:배너 정보가 존재하지 않습니다</Text></View>

    return (
        <View style={{ display: 'flex', flex: 1, backgroundColor: Color['grey100'] }}>
            <View style={{ paddingVertical: 24, backgroundColor: Color['grey100'] }}>
                <View style={{ marginHorizontal: 24 }}>
                    <Banner withIndicator={false} />
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', }}>
                <Pressable
                    style={{ position: 'relative', flex: 1, display: 'flex', backgroundColor: viewingPart == 'PROMOTION' ? '#FFF' : Color['grey100'] }}
                    onPress={() => setViewingPart('EVENT')}>
                    <View style={[{ display: 'flex', alignItems: 'center', backgroundColor: viewingPart == 'EVENT' ? '#FFF' : Color['grey100'], justifyContent: 'center', paddingVertical: 16 },
                    viewingPart == 'EVENT' ? { borderTopRightRadius: 10, borderTopLeftRadius: 10 } : { borderBottomRightRadius: 10 }]}>
                        <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', }}>이벤트</Text>
                    </View>
                </Pressable>
                <Pressable
                    style={{ position: 'relative', flex: 1, display: 'flex', backgroundColor: viewingPart == 'EVENT' ? '#FFF' : Color['grey100'] }}
                    onPress={() => setViewingPart('PROMOTION')}>
                    <View
                        style={[{ display: 'flex', alignItems: 'center', backgroundColor: viewingPart == 'PROMOTION' ? '#FFF' : Color['grey100'], justifyContent: 'center', paddingVertical: 16 },
                        viewingPart == 'PROMOTION' ? { borderTopLeftRadius: 10, borderTopRightRadius: 10 } : { borderBottomLeftRadius: 10 }]}>
                        <Text style={{ fontSize: 16, fontFamily: 'NanumSquareNeo-Regular', }}>홍보</Text>
                    </View>
                </Pressable>
            </View>
            <View style={{ display: 'flex', flex: 1, backgroundColor: '#FFF', paddingVertical: 12, }}>
                <FlatList
                    contentContainerStyle={{ marginHorizontal: 16 }}
                    data={banners.value}
                    renderItem={({ item }) => (
                        <BannerWithPlaceholder
                            key={item.id} bannerItem={item} />
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                    initialNumToRender={3} // 초기 렌더링할 아이템 개수
                    windowSize={5} // 렌더링 영역의 아이템 개수
                />
            </View>
        </View>
    )
}

export const BannerWithPlaceholder = ({ bannerItem }: { bannerItem: BannerFetchData }) => {

    const [isLoading, setLoading] = useState(true);

    return (
        <Pressable style={{ height: 120, borderRadius: 10, overflow: 'hidden' }}
            onPress={() => { !isLoading && bannerItem.href && Linking.openURL(bannerItem.href) }}>
            {isLoading ?
                <View style={{ flex: 1 }}>
                    <ActivityIndicator size="large" color="#888" />
                </View>
                :
                <Image src={bannerItem.bannerImgUrl} style={{ height: 120, width: '100%', alignItems: 'center' }} resizeMode="cover"
                    onLoad={() => setLoading(false)} />
            }
        </Pressable>
    );
};

export default BannersScreen

const styles = StyleSheet.create({})