import { Button, Pressable, StyleSheet, Text, View } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react'

const CheckOutCameraScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

    const ShootingCnt = 5;

    const [permission, requestPermission] = useCameraPermissions();
    const [photos, setPhotos] = useState<{ url: string, originHeight: number, originWidth: number }[]>([]);
    const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
    useEffect(() => {
        if (photos.length > 0)
            setPhotos([])
    }, [])

    useEffect(() => {
        if (photos.length == ShootingCnt)
            navigation.navigate('PictureCheck', { photos });
    }, [photos])

    const takePictureHandler = async () => {
        if (!cameraRef) return;

        let photo = await cameraRef.takePictureAsync();

        if (photo)
            setPhotos([...photos, { url: photo.uri, originHeight: photo.height, originWidth: photo.width }]);
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
            <CameraView ref={(ref: any) => setCameraRef(ref)} style={{ flex: 1 }} facing='back'
            >
                <Text>CheckOutCameraScreen</Text>
                <Pressable style={{ width: 40, height: 40, backgroundColor: '#FFF', alignSelf: 'center', bottom: 90, position: 'absolute' }}
                    onPress={takePictureHandler}
                ></Pressable>
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