import { StyleSheet, View, Image, Dimensions, FlatList, Pressable, Text, Modal, ActivityIndicator, Alert, } from 'react-native'
import React, { useEffect, useState } from 'react'

import ImageViewer from 'react-native-image-zoom-viewer';
import { Color } from '../../ColorSet';
import Header from '@hongpung/components/Header';
import { loginUserState, useOnReserve } from '@hongpung/recoil/authState';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { onUseSession } from '@hongpung/recoil/sessionState';
import { StackActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckOutStackParamList } from '@hongpung/nav/HomeStacks';
import { getToken } from '@hongpung/utils/TokenHandler';

const { width } = Dimensions.get('window');

type PictureCheckProps = NativeStackScreenProps<CheckOutStackParamList, 'PictureCheck'>

const PictureCheckScreen: React.FC<PictureCheckProps> = ({ navigation, route }) => {

    const { photos } = route.params
    const [selectedIndex, setSelectIndex] = useState(0);
    const [indicatorVisible, setIndicatorVisible] = useState(true)

    const [loading, setLoading] = useState(false)

    const sessionData = useRecoilValue(onUseSession)
    const setRoomSocket = useSetRecoilState(useOnReserve)
    const loginUser = useRecoilValue(loginUserState)

    const applyIndex = async (index: number) => {
        setSelectIndex(index);
    }
    // const [photos, setPhotos] = useState<File[]>([]);

    const endSession = () => {
        const endfetch = async () => {
            try {
                if (!sessionData) throw Error('진행 중인 세션 정보가 없습니다.')

                const token = await getToken('utilToken')

                setLoading(true)

                const formData = new FormData();

                const photoFiles = photos.map(photo => {

                    const imageUri = photo.uri;
                    const imageName = imageUri.split('/').pop();
                    const imageType = `image/${imageName?.split('.').pop()}`;

                    const imageFile = {
                        uri: imageUri,
                        name: imageName,
                        type: imageType,
                    } as unknown as File;

                    return imageFile
                })

                photoFiles.forEach((photo, index) => {
                    formData.append('images', photo, `${photo.name}-${sessionData!.date}-${index}-${(new Date).toISOString()}`); // React Native에서 FormData 파일 처리 방식
                });

                formData.append('path', 'end-session'); // 업로드 경로

                const pictureUpload = await fetch(`${process.env.SUB_API}/upload-s3/images`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                    },
                    body: formData,
                });

                const { uploadUrls }: { uploadUrls: { uploadUrl: string; imageUrl: string }[] } = await pictureUpload.json()
                console.log(uploadUrls)
                for (let i = 0; i < photos.length; i++) {
                    const { uploadUrl } = uploadUrls[i];
                    await fetch(uploadUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'image/jpeg', // MIME 타입 지정
                        },
                        body: photoFiles[i],
                    });
                }

                const imageUrls = uploadUrls.map(url => (url.imageUrl))
                console.log(imageUrls)

                const response = await fetch(`${process.env.SUB_API}/room-session/end`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ returnImageUrls: imageUrls })
                })

                if (!response.ok) throw Error('Failed')
                const { message } = await response.json();
                console.log(message)

                if (message != 'Fail') {
                    setRoomSocket(false)
                    navigation.navigate('CheckOutEnd')
                }

            } catch (e) {
                console.log(e)
                if (e instanceof Error) {
                    if (e.message == '진행 중인 세션 정보가 없습니다.') {
                        {
                            alert(e.message)
                            navigation.dispatch(StackActions.replace('HomeStack'))
                        }
                    }
                }
                alert('종료 중 오류가 발생했어요.\n다시 시도해주세요.')
            }
            finally {
                setLoading(false)
            }
        }
        endfetch()
    }


    return (
        <>
            <Modal visible={loading}>
                <View style={{ flex: 1, backgroundColor: '#FFF', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color={Color['blue500']} size={'large'} />
                </View>
            </Modal>
            <View style={{ flex: 1 }}>
                {indicatorVisible &&
                    <Header leftButton='close' HeaderName={'종료어쩌구'} RightButton='보내기' RightAction={() => { endSession() }}></Header>
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
        </>
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