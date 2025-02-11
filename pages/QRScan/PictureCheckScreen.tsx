import { StyleSheet, View, Image, Dimensions, FlatList, Pressable, Text, Modal, ActivityIndicator, Alert, } from 'react-native'
import React, { useEffect, useState } from 'react'

import ImageViewer from 'react-native-image-zoom-viewer';
import { Color } from '../../ColorSet';
import Header from '@hongpung/components/common/Header';
import { loginUserState, useOnReserve } from '@hongpung/recoil/authState';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { onUseSession } from '@hongpung/recoil/sessionState';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckOutStackParamList } from '@hongpung/nav/HomeStacks';
import { getToken } from '@hongpung/utils/TokenHandler';
import { useCheckOut } from './context/useCheckOutContext';

const { width } = Dimensions.get('window');


const PictureCheckScreen: React.FC = () => {

    const navigation = useNavigation();

    const { endSession, photos } = useCheckOut();
    const [selectedIndex, setSelectIndex] = useState(0);
    const [indicatorVisible, setIndicatorVisible] = useState(true)


    const applyIndex = async (index: number) => {
        setSelectIndex(index);
    }

    return (
        <View style={{ flex: 1 }}>
            {indicatorVisible &&
                <Header leftButton='close' HeaderName={'정리 사진 확인'} RightButton='보내기' RightAction={() => { endSession() }}></Header>
            }
            {photos.length > 0 && <View style={[styles.container, { zIndex: 0 }]}
            >
                <ImageViewer
                    key={photos.length}
                    onChange={(index) => setSelectIndex(index!)}
                    index={selectedIndex}
                    renderIndicator={() => <View />}
                    enableImageZoom
                    onClick={() => setIndicatorVisible(!indicatorVisible)}
                    enableSwipeDown
                    swipeDownThreshold={10}
                    onSwipeDown={() => navigation.goBack()}
                    imageUrls={photos.map(image => ({ url: image.uri }))}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        width,
                        height: 'auto',
                    }}
                />
            </View>}
            {indicatorVisible && <View
                style={{ position: 'absolute', bottom: 4, zIndex: 3, width: width, alignItems: 'center' }}
            >
                <FlatList
                    horizontal
                    data={photos}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable
                                key={item.uri.slice(-11, -5) + index * 11}
                                onPress={() => {
                                    applyIndex(index);
                                }}>
                                <Image
                                    source={{ uri: item.uri }}
                                    style={[{
                                        width: 75, // 화면의 너비에 맞춤
                                        height: 75, // 비율에 따라 높이 조정
                                    }, index == selectedIndex && { borderWidth: 4, borderColor: Color['blue400'] }]}></Image>
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