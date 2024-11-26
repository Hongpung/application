import { StyleSheet, View, Image, Dimensions, FlatList, Pressable, Text, Modal, ActivityIndicator, Alert, } from 'react-native'
import React, { useEffect, useState } from 'react'

import ImageViewer from 'react-native-image-zoom-viewer';
import { Color } from '../../ColorSet';
import Header from '@hongpung/components/Header';
import { loginUserState, useOnReserve } from '@hongpung/recoil/authState';
import { useRecoilState, useRecoilValue } from 'recoil';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const PictureCheckScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

    const [selectedIndex, setSelectIndex] = useState(0);
    const [indicatorVisible, setIndicatorVisible] = useState(true)

    const [loading, setLoading] = useState(false)

    const [useRoomSocket, setRoomSocket] = useRecoilState(useOnReserve)
    const loginUser = useRecoilValue(loginUserState)

    const applyIndex = async (index: number) => {
        setSelectIndex(index);
    }
    const [photos, setPhotos] = useState<File[]>([]);

    const [photoUris, setPhotoUris] = useState<string[]>([])

    const takePictureHandler = async () => {
        // 카메라 권한 요청
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Camera access is needed to take pictures.');
            return;
        }

        // 카메라 실행
        for (const _ of Array(2)) { // 2번 반복
            const result = await ImagePicker.launchCameraAsync({

                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                const imageName = imageUri.split('/').pop();
                const imageType = `image/${imageName?.split('.').pop()}`;

                const imageFile = {
                    uri: imageUri,
                    name: imageName,
                    type: imageType,
                } as unknown as File;

                console.log(imageUri);
                setPhotoUris((prevUris) => [...prevUris, imageUri]);
                setPhotos((prevPhotos) => [...prevPhotos, imageFile]);
            }
        }
    };

    const endSession = () => {
        const endfetch = async () => {
            try {

                setLoading(true)

                const formData = new FormData();

                photos.forEach((photo, index) => {
                    formData.append('images', photo, `${photo.name}-${(new Date).toISOString()}`); // React Native에서 FormData 파일 처리 방식
                });

                formData.append('path', 'end-session'); // 업로드 경로

                const pictureUpload = await fetch(`${process.env.SUB_API}/upload-s3/images`, {
                    method: 'POST',
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
                        body: photos[i],
                    });
                }

                const imageUrls = uploadUrls.map(url => (url.imageUrl))
                console.log(imageUrls)

                const response = await fetch(`${process.env.SUB_API}/room-session/end/${loginUser?.memberId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
                alert(e)
            }
            finally {
                setLoading(false)
            }
        }
        endfetch()
    }

    useEffect(() => {
        takePictureHandler()
    }, [])

    return (
        <>
            <Modal visible={loading}>
                <View style={{ backgroundColor: '#FFF', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color={Color['blue500']} size={'large'} />
                </View>
            </Modal>
            <View style={{ flex: 1 }}>
                {indicatorVisible &&
                    <Header leftButton='close' HeaderName={'종료어쩌구'} RightButton='보내기' RightAction={() => { endSession() }}></Header>
                }
                {photoUris.length > 0 && <View style={[styles.container, { zIndex: 0 }]}
                >
                    <ImageViewer
                        key={photoUris.length}
                        onChange={(index) => setSelectIndex(index!)}
                        index={selectedIndex}
                        renderIndicator={() => <View />}
                        enableImageZoom
                        onClick={() => setIndicatorVisible(!indicatorVisible)}
                        enableSwipeDown
                        swipeDownThreshold={10}
                        onSwipeDown={() => navigation.goBack()}
                        imageUrls={photoUris.map(image => ({ url: image }))}
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
                        data={photoUris}
                        renderItem={({ item, index }) => {
                            return (
                                <Pressable
                                    key={item.slice(-11, -5) + index * 11}
                                    onPress={() => {
                                        applyIndex(index);
                                    }}>
                                    <Image
                                        source={{ uri: item }}
                                        style={[{
                                            width: 75, // 화면의 너비에 맞춤
                                            height: 75, // 비율에 따라 높이 조정
                                        }, item == photoUris[selectedIndex] && { borderWidth: 4, borderColor: Color['blue400'] }]}></Image>
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