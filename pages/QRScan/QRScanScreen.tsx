import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Pressable, Linking, Dimensions, Modal, Platform, Alert, Image } from 'react-native';

import { CameraType, CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import QRScanBackDrop from '@hongpung/assets/images/QR_SCAN_BACKDROP.svg';
import { Color } from '@hongpung/ColorSet';
import LongButton from '@hongpung/src/common/components/buttons/long-button';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { MainStackParamList } from '@hongpung/nav/HomeStacks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { debounce } from 'lodash';
import { Icons } from '@hongpung/src/common/components/icons/Icon';


type QRScanNavProps = NativeStackNavigationProp<MainStackParamList, 'QRScan'>;

const { width, height } = Dimensions.get('screen');

const QRScanScreen: React.FC = () => {

    const navigation = useNavigation<QRScanNavProps>();
    const isFocusing = useIsFocused()
    const [permission, requestPermission] = useCameraPermissions();
    const [scanStatus, setScanStatus] = useState<'IDLE' | 'PROCESSING' | 'COMPLETE' | 'FAILED'>('IDLE');
    const [flash, setFlash] = useState<'on' | 'off'>('off');

    const toggleFlash = () => {
        setFlash(prev => prev == 'on' ? 'off' : 'on');
    }

    useEffect(() => {
        setScanStatus('IDLE')
    }, [isFocusing])

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>카메라 권한이 필요합니다</Text>
                <Button onPress={requestPermission} title="카메라 권한 설정" />
            </View>
        );
    }



    const handleOpen = (url: string) => {
        if (scanStatus != 'IDLE') return
        const openUrl = async () => {
            try {

                if (!url.startsWith('https://hongpung.com')) throw Error('invalid Url')

                Alert.alert(
                    'QR코드 인식 완료',
                    'QR코드 인식이 완료되었습니다.',
                    [{
                        text: '확인', onPress: () => {
                            navigation.navigate('CheckIn');
                            setScanStatus('COMPLETE');
                        }
                    }])

            }
            catch (err) {
                setScanStatus('FAILED')
            }
        }
        openUrl();
    };

    const isInCenter = (x: number, y: number) => {
        const centerWidth = 200;
        const centerHeight = 200;
        const centerX = width / 2;
        const centerY = 220;

        console.log({ x, y, centerX })
        return (
            x > centerX - centerWidth / 2 //범위 지정
            && x < centerX + centerWidth / 2
            && y > centerY - centerHeight / 2
            && y < centerY + centerHeight / 2
        );
    };

    const handleScanned = ({ type, data, bounds }: BarcodeScanningResult) => {

        if (scanStatus != 'IDLE' || type != 'qr') return;

        const { origin, size } = bounds;

        if (Platform.OS == 'ios') {
            console.log(origin, size)
            const centerX = origin.x + size.width / 2;
            const centerY = origin.y + size.height / 2;

            if (isInCenter(centerX, centerY)) {
                setScanStatus('PROCESSING')
                handleOpen(data)
            }
        } else if (Platform.OS == 'android') {

            console.log(origin, size)

            const centerX = origin.y + size.height / 2;
            const centerY = origin.x + size.height / 2;

            if (isInCenter(centerX, centerY)) {
                setScanStatus('PROCESSING')
                handleOpen(data)
            }
        }

    }

    const onScanned = debounce(handleScanned, 200, { leading: true, trailing: false })

    return (
        <View style={styles.container}>
            {isFocusing && permission.granted && (
                <CameraView
                    style={styles.camera}
                    facing={'back'}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                    enableTorch={flash == 'on'}
                    onBarcodeScanned={onScanned}
                    ratio='16:9'
                >
                    <QRScanBackDrop style={{ position: 'absolute', left: -420 + 120 + (width - 200) / 2, top: 0 }} />
                    {/* <View style={styles.overlay}>
                        <BlurView tint='dark' intensity={80} style={styles.topOverlay} />
                        <View style={styles.centerOverlay}>
                            <BlurView tint='dark' intensity={80} style={styles.leftOverlay} />
                            <View style={styles.focused} />
                            <BlurView tint='dark' intensity={80} style={styles.rightOverlay} />
                        </View>
                        <BlurView tint='dark' intensity={80} style={styles.bottomOverlay} />
                    </View> */}
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.button}
                            onPress={toggleFlash} >
                            <Icons name={flash === 'on' ? 'flashlight-outline' : 'flashlight'}></Icons>
                        </Pressable>
                        <Text style={styles.descript}>QR코드를 스캔해주세요</Text>
                    </View>
                </CameraView>
            )}
            <Modal visible={scanStatus == 'FAILED'} transparent>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <View style={{
                        borderRadius: 20,
                        minHeight: 200,
                        paddingVertical: 24,
                        marginHorizontal: 24,
                        display: 'flex',
                        gap: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: 'red',
                        }}>유효하지 않은 QR코드 입니다.</Text>
                        <Text style={{
                            fontSize: 16,
                            color: '#333',
                        }}>확인 후 다시 촬영해주세요.</Text>
                        <View style={{ width: '100%', marginTop: 16 }}>
                            <LongButton color='blue' innerText='확인' isAble={true} onPress={() => setScanStatus('IDLE')} />
                        </View>
                    </View>
                </View>
            </Modal>
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
        borderRadius: 25,
        justifyContent: 'center',
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
        height: 144,

    },
    centerOverlay: {
        flexDirection: 'row',
    },
    leftOverlay: {
        flex: 1,
        height: 240,
    },
    focused: {
        width: 240,
        height: 240,
    },
    rightOverlay: {
        flex: 1,
        height: 240,
    },
    bottomOverlay: {
        flex: 1,
        width: '100%',

    },
});
