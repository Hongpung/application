import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { type BannerBookMarkProps } from './type'
import { Color } from '@hongpung/src/common'
import { BannerItem } from '@hongpung/src/entities/banner'

const BannerBookMark: React.FC<BannerBookMarkProps> = ({ banners }) => {

    const [viewingPart, setViewingPart] = useState<'PROMOTION' | 'EVENT'>('PROMOTION')

    return (
        <View>
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

export default BannerBookMark

const styles = StyleSheet.create({})