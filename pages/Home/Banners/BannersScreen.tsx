import { FlatList, Pressable, StyleSheet, Text, View, Image, Linking } from 'react-native'
import React, { useState } from 'react'
import { Color } from '@hongpung/ColorSet'
import useFetch from '@hongpung/hoc/useFetch'
import Banner from '@hongpung/components/home/Banner'
import useBannerFetch from '@hongpung/components/home/useBannerFetch'

const BannersScreen: React.FC = () => {

    const [viewingPart, setViewingPart] = useState<'EVENT' | 'PROMOTION'>('EVENT')
    const [banners, isLoading] = useBannerFetch();

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

                {isLoading ? <FlatList
                    data={[1, 2, 3]}
                    renderItem={({ item, index }) => (
                        <View key={index + 1} style={{ height: 120, borderRadius: 10, backgroundColor:Color['grey200'], marginHorizontal: 16, }}>
                        </View>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                /> :
                    <FlatList
                        data={banners}
                        renderItem={({ item: banner, index }) => (
                            <Pressable key={index + 1} style={{ height: 120, borderRadius: 10, overflow: 'hidden', marginHorizontal: 16, }}
                                onPress={() => { banner.href && Linking.openURL(banner.href) }}>
                                <Image src={banner.bannerImgUrl} style={{ height: 120, width: '100%', alignItems: 'center' }} resizeMode="cover" />
                            </Pressable>
                        )}
                        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                    />}
            </View>
        </View>
    )
}

export default BannersScreen

const styles = StyleSheet.create({})