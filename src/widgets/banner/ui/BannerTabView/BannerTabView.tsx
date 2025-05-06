import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Color } from '@hongpung/src/common'
import { Banner, BannerItem } from '@hongpung/src/entities/banner'

type BannerBookMarkProps = {
    banners: Banner[]
}

export const BannerTabView: React.FC<BannerBookMarkProps> = ({ banners }) => {

    const [viewingPart, setViewingPart] = useState<'PROMOTION' | 'EVENT'>('PROMOTION')

    return (
        <View>
            <View style={{ display: 'flex', flexDirection: 'row', borderTopLeftRadius: 15, borderTopRightRadius: 15, backgroundColor: '#FFF' }}>
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
                    contentContainerStyle={{ marginHorizontal: 16, gap: 12 }}
                    data={banners.filter(banner => banner.tag === viewingPart)}
                    renderItem={({ item }) => (
                        <BannerItem
                            key={item.bannerId} banner={item} onBannerPress={() => { }} />
                    )}
                    initialNumToRender={8} // 초기 렌더링할 아이템 개수
                    windowSize={6} // 렌더링 영역의 아이템 개수
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})