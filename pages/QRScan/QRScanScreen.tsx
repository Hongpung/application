import React, { useState,  useEffect } from 'react';
import { StyleSheet, Text, View, Button, Pressable, Linking, Dimensions } from 'react-native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Color } from '../../ColorSet';
import { debounce } from 'lodash';

const QRScanScreen: React.FC = () => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    let isScanned: boolean = false


    useEffect(() => {
        isScanned = false;
    }, [])

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>카메라 권한이 필요합니다</Text>
                <Button onPress={requestPermission} title="카메라 권한 설정" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const openUrl = (url: string) => {
        if (!isScanned) return
        Linking.openURL(url)
            .catch((err) => { console.error('Failed to open URL:', err); })
            .finally(debounce(() => isScanned = false, 500))
    };

    const isInCenter = (x: number, y: number) => {
        const { width, height } = Dimensions.get('window');
        const centerWidth = 360;
        const centerHeight = centerWidth;
        const centerX = width / 2;
        const centerY = height / 2;

        return x > centerX - centerWidth / 2 && x < centerX + centerWidth / 2 && y > centerY - centerHeight / 2 && y < centerY + centerHeight / 2;
    };

    const handleScanned = ({ type, data, bounds }: { type: string; data: string, bounds: { origin: { x: number, y: number }, size: { width: number, height: number } } }) => {

        if (isScanned) return;

        const { origin, size } = bounds;
        const centerX = origin.x + size.width / 2;
        const centerY = origin.y + size.height / 2;

        if (isInCenter(centerX, centerY)) {
            isScanned = true;
            openUrl(data)
        }
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={handleScanned}
            >
                <View style={styles.overlay}>
                    <View style={styles.topOverlay} />
                    <View style={styles.centerOverlay}>
                        <View style={styles.leftOverlay} />
                        <View style={styles.focused} />
                        <View style={styles.rightOverlay} />
                    </View>
                    <View style={styles.bottomOverlay} />
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={toggleCameraFacing} />
                    <Text style={styles.descript}>QR코드를 스캔해주세요</Text>
                </View>
            </CameraView>
        </View>
    );
};

export default QRScanScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        marginBottom: 136,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#FFF',
        width: 64,
        height: 64,
        borderRadius: 25
    },
    descript: {
        color: '#FFF',
        marginTop: 42,
        fontFamily: 'NanumSquareNeo-ExtraBold',
        fontSize: 16
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topOverlay: {
        width: '100%',
        backgroundColor: Color['grey700'],
        height: 144,
        opacity: 0.3
    },
    centerOverlay: {
        flexDirection: 'row',
    },
    leftOverlay: {
        flex: 1,
        height: 240,
        backgroundColor: Color['grey700'],
        opacity: 0.3
    },
    focused: {
        width: 240,
        height: 240,
    },
    rightOverlay: {
        flex: 1,
        height: 240,
        backgroundColor: Color['grey700'],
        opacity: 0.3,
    },
    bottomOverlay: {
        flex: 1,
        width: '100%',
        backgroundColor: Color['grey700'],
        opacity: 0.3,
    },
});
