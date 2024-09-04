import { StyleSheet, View, Image, Dimensions, FlatList, Pressable, Text, } from 'react-native'
import React, { useEffect, useState } from 'react'

import ImageViewer from 'react-native-image-zoom-viewer';
import { Color } from '../../ColorSet';

const { width, height } = Dimensions.get('window');

const PictureCheckScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const { photos }: { photos: { url: string, originWidth: number, originHeight: number }[] } = route.params;

    const [selectedIndex, setSelectIndex] = useState(0);
    const [indicatorVisible, setIndicatorVisible] = useState(true)


    const applyIndex = async (index: number) => {
        setSelectIndex(index);
    }

    return (
        <View style={{ flex: 1 }}>
            {indicatorVisible && <View style={[styles.HeadrContainer, { zIndex: 2 }]}>
                <Pressable onPress={() => {
                    navigation.goBack();
                }}
                    style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 18, left: 22, width: 28, height: 28, backgroundColor: Color['grey300'] }}
                >
                    <Text style={styles.Text}>{'<-'}</Text>
                </Pressable>
                <Pressable onPress={() => {
                    //fetch 수행
                    navigation.navigate('CheckOutEnd');
                }}
                    style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 18, right: 22, width: 48, height: 28, backgroundColor: Color['grey300'] }}
                >
                    <Text style={styles.Text}>{'보내기'}</Text>
                </Pressable>
            </View>}
            {/* {indicatorVisible && selectedIndex > 0 && <Pressable style={{ position: 'absolute', left: 0, top: height / 2 - 60, width: 40, height: 40, zIndex: 5, backgroundColor: 'rgba(0,0,0,0.75)', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => { applyIndex(selectedIndex - 1); }}>
                <Text style={{ color: '#FFF', fontFamily: 'NanumSquareNeo-ExtraBold', fontSize: 24 }}>{`<`}</Text>
            </Pressable>}
            {indicatorVisible && images.length - 1 > selectedIndex && <Pressable style={{ position: 'absolute', right: 0, top: height / 2 - 60, width: 40, height: 40, zIndex: 5, backgroundColor: 'rgba(0,0,0,0.75)', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => { applyIndex(selectedIndex + 1); }}>
                <Text style={{ color: '#FFF', fontFamily: 'NanumSquareNeo-ExtraBold', fontSize: 24 }}>{`>`}</Text>
            </Pressable>} */}
            <View style={[styles.container, !indicatorVisible ? { zIndex: 2 } : { zIndex: 0 }]}
            >
                <ImageViewer
                    onChange={(index) => setSelectIndex(index!)}
                    index={selectedIndex}
                    renderIndicator={() => <View />}
                    enableImageZoom
                    onClick={() => setIndicatorVisible(!indicatorVisible)}
                    enableSwipeDown
                    swipeDownThreshold={10}
                    onSwipeDown={() => navigation.goBack()}
                    imageUrls={photos.map(image => ({ url: image.url, originWidth: image.originWidth, originHeight: image.originHeight }))}
                    style={{
                        width: width, // 화면의 너비에 맞춤
                        height: (photos[selectedIndex].originHeight / photos[selectedIndex].originWidth) * width,
                    }}
                />
            </View>
            {indicatorVisible && <View
                style={{ position: 'absolute', bottom: 4, zIndex: 3, width: width, alignItems: 'center' }}
            >
                <FlatList
                    horizontal
                    data={photos}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable
                                key={item.url.slice(-11,-5)+index*11}
                                onPress={() => {
                                    applyIndex(index);
                                }}>
                                <Image
                                    source={{ uri: item.url }}
                                    style={[{
                                        width: 75, // 화면의 너비에 맞춤
                                        height: 75, // 비율에 따라 높이 조정
                                    }, item == photos[selectedIndex] && { borderWidth: 4, borderColor: Color['blue400'] }]}></Image>
                            </Pressable>)
                    }}
                    ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
                />
            </View>}
        </View>

    );
};


export default PictureCheckScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Text: {
        fontFamily: "NanumSquareNeo-Bold",
        height: 24,
        color: Color['blue500'],
        fontSize: 18,
        textAlign: 'right',
        textAlignVertical: 'center'
    },
    sendUser: {
        fontFamily: "NanumSquareNeo-Regular",
        color: Color['grey100'],
        fontSize: 22,
        textAlign: 'center'
    },
    sendDate: {
        fontFamily: "NanumSquareNeo-Light",
        color: Color['grey300'],
        fontSize: 12,
        textAlign: 'center'
    },
    HeadrContainer: {
        zIndex: 1,
        position: 'absolute',
        width: width,
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.9)',
        paddingHorizontal: 24
    }
});