import { Button, Pressable, StyleSheet, Text, View } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react'
import Header from '@hongpung/components/Header';
import { useRecoilValue } from 'recoil';
import { onUseSession } from '@hongpung/recoil/sessionState';
import { useIsFocused } from '@react-navigation/native';

const CheckOutCameraScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

    const isFocusing = useIsFocused()
    const sessionData = useRecoilValue(onUseSession)
    const [permission, requestPermission] = useCameraPermissions();
    const [photos, setPhotos] = useState<{ uri: string, originHeight: number, originWidth: number }[]>([]);
    const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
    const shootingCount = (sessionData?.borrowInstruments?.length || 0) + 2;

    useEffect(() => {
        if (photos.length > 0)
            setPhotos([])
    }, [isFocusing])

    useEffect(() => {
        if (photos.length == shootingCount)
            navigation.navigate('PictureCheck', { photos: photos });
    }, [photos])

    const takePictureHandler = async () => {
        if (!cameraRef) return;

        let photo = await cameraRef.takePictureAsync({ quality: 0.5, imageType: 'jpg'});

        if (photo) {
            console.log(photo.uri + 'ss')
            const response = await fetch(photo.uri);
            const blob = await response.blob();
            console.log('blobCreaterd', blob)
            setPhotos([...photos, { uri: photo.uri, originHeight: photo.height, originWidth: photo.width }]);
        }
    };


    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>카메라 권한이 필요해요</Text>
                <Button onPress={requestPermission} title="카메라 권한 설정" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Header leftButton='close' HeaderName={`${photos.length}/${shootingCount}`} RightButton='다시 찍기' RightAction={() => { const newPhotos = photos; newPhotos.pop(); setPhotos(newPhotos) }}></Header>
            <CameraView ref={(ref: any) => setCameraRef(ref)} style={{ flex: 1 }} facing='back'
            >
                <Pressable style={{ width: 64, height: 64, borderColor: '#FFF', borderWidth: 3, backgroundColor: 'transparent', alignSelf: 'center', bottom: 90, position: 'absolute', borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onPress={takePictureHandler}
                >
                    <View style={{ width: 52, height: 52, backgroundColor: '#FFF', alignSelf: 'center', position: 'absolute', borderRadius: 100 }}></View>
                </Pressable>
            </CameraView>
        </View>
    )
}

export default CheckOutCameraScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }, message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
})