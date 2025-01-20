import { StyleSheet, View, Image, Dimensions, FlatList, Pressable, Text, } from 'react-native'
import React, { useEffect, useState } from 'react'

import ImageViewer from 'react-native-image-zoom-viewer';
import { Color } from '../../ColorSet';
import { Icons } from '@hongpung/components/common/Icon';

const { width, height } = Dimensions.get('window');

const ChatMediaViewerScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const { images, selectedImgId }: { images: { user: string, id: string, uri: string, originHeight: number, originWidth: number }[], selectedImgId: string } = route.params;

    const [selectedIndex, setSelectIndex] = useState(0);
    const [indicatorVisible, setIndicatorVisible] = useState(true)

    useEffect(() => {
        const index = images.findIndex(image => image.id == selectedImgId);
        applyIndex(index);
    }, [])

    const applyIndex = async (index: number) => {
        setSelectIndex(index);
    }

    return (
        <View style={{ flex: 1 }}>
            {indicatorVisible && <View style={[styles.HeadrContainer, { zIndex: 2 }]}>
                <Pressable onPress={() => {
                    navigation.goBack();
                }}
                    style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 18, left: 22, width: 28, height: 28}}
                >
                    <Icons name='arrow-back' color={'#FFF'}/>
                </Pressable>
                <View>
                    <Text style={styles.sendUser}>{images[selectedIndex]?.user}</Text>
                    <Text style={styles.sendDate}>2024.03.07(수)</Text>
                </View>
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
                    onChange={(index)=>setSelectIndex(index!)}
                    index={selectedIndex}
                    renderIndicator={()=><View/>}
                    enableImageZoom
                    onClick={() => setIndicatorVisible(!indicatorVisible)}
                    enableSwipeDown
                    swipeDownThreshold={10}
                    onSwipeDown={() => navigation.goBack()}
                    imageUrls={images.map(image => ({ url: image.uri, originWidth: image.originWidth, originHeight: image.originHeight }))}
                    style={{
                        width: width, // 화면의 너비에 맞춤
                        height: (images[selectedIndex].originHeight / images[selectedIndex].originWidth) * width,
                    }}
                />
            </View>
            {indicatorVisible && <View
                style={{ position: 'absolute', bottom: 4, zIndex: 3, width: width, alignItems: 'center' }}
            >
                <FlatList
                    horizontal
                    data={images}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable
                                key={item.id + item.user}
                                onPress={() => {
                                    applyIndex(index);
                                }}>
                                <Image
                                    source={{ uri: item.uri }}
                                    style={[{
                                        width: 75, // 화면의 너비에 맞춤
                                        height: 75, // 비율에 따라 높이 조정
                                    }, item == images[selectedIndex] && { borderWidth: 4, borderColor: Color['blue400'] }]}></Image>
                            </Pressable>)
                    }}
                    ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
                />
            </View>}
        </View>

    );
};


export default ChatMediaViewerScreen

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