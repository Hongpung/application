import { StyleSheet, TextInput, Text, View, ScrollView, Image, Modal, Pressable, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, TextInputChangeEventData, NativeSyntheticEvent, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Color } from '../../../../ColorSet';
import { Instrument, InstrumentCreateDTO, InstrumentEditDTO, InstrumentType, instrumentTypes } from '../../../../UserType';
import LongButton from '../../../../components/buttons/LongButton';
import { useRecoilValue } from 'recoil';
import { loginUserState } from '@hongpung/recoil/authState';
import { Icons } from '@hongpung/components/Icon';
import { getToken } from '@hongpung/utils/TokenHandler';
import Toast from 'react-native-toast-message';
import uploadImage from '@hongpung/utils/uploadImage';
import * as ImagePicker from 'expo-image-picker';


const showDeleteCompleteToast = () => {
    Toast.show({
        type: 'success',
        text1: '악기 삭제를 완료했어요!',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    });
};
const showEditCompleteToast = () => {
    Toast.show({
        type: 'success',
        text1: '악기 수정을 완료했어요!',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    });
};


const InstrumentEditScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {

    const { instrumentInform } = route.params ?? { instrumentInform: null };

    const loginUser = useRecoilValue(loginUserState);


    const [instrumentsEngType] = useState(['KKWANGGWARI', 'JANGGU', 'BUK', 'SOGO', 'JING', 'ETC'])

    const [selectedImage, setImageFile] = useState<File | null>(null);
    const [selectedImageUri, setImageUri] = useState<string | null>(null);

    const [onSelectType, setSelectTypeVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);


    const [instrument, setInstrument] = useState<Instrument>(instrumentInform ? JSON.parse(instrumentInform) :
        { available: true, club: loginUser?.club, borrowHistory: [], name: '', instrumentId: -1, type: '쇠' })

    const parseInstrument = (type: InstrumentType): string => {
        const instrumentEnumNo = instrumentTypes.indexOf(type)
        return instrumentsEngType[instrumentEnumNo];
    }

    const dropdownCloseHandler = () => {
        if (onSelectType)
            setSelectTypeVisible(false)
    }

    const chageName = (e: string) => {
        setInstrument({ ...instrument, name: e })
    };
    const pickImageFromAlbum = async () => {
        // 권한 요청
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('권한 필요', '앨범 접근 권한이 필요합니다.');
            return;
        }

        // 앨범에서 이미지 선택
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true, // 선택 후 편집 가능
            aspect: [300, 200], // 편집 비율 설정 (4:3)
            quality: 0.5, // 이미지 품질 설정 (0 ~ 1)
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            const imageName = imageUri.split('/').pop();
            const imageType = `image/${imageName?.split('.').pop()}`; // MIME 타입 추정

            const imageFile = {
                uri: imageUri,
                name: imageName,
                type: imageType,
            } as unknown as File;

            console.log(imageFile)
            setImageUri(imageUri);
            setImageFile(imageFile); // 선택된 이미지의 URI 저장
        }
    };

    const DeleteHandler = () => {
        const deleteInstrument = async () => {
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {
                setLoading(true)
                const token = await getToken('token');

                if (!token) throw Error('invalid Token');

                const response = await fetch(`${process.env.BASE_URL}/instrument/${instrument.instrumentId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                    },
                    signal,
                })

                if (!response.ok) throw Error('Server Error' + response.status)

                showDeleteCompleteToast();
                navigation.navigate('InstrumentsHome');

            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.error('Request was canceled' + err.status);
                } else {
                    console.error(err.message + ' ' + err.status);
                }
            } finally {
                clearTimeout(timeoutId);
                setLoading(false)
            }
        }
        deleteInstrument()
    }

    const SubmitHandler = () => {

        const editInstrument = async () => {
            console.log(instrument.instrumentId + `수정`)
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {
                setLoading(true)
                const token = await getToken('token');

                if (!token) throw Error('invalid Token');

                const submitForm: InstrumentEditDTO = { available: true, name: instrument.name, type: parseInstrument(instrument.instrumentType) }

                if (!!selectedImage) {
                    console.log('이미지 업로드 수행중')
                    const uploadRespone = await uploadImage(selectedImage, 'instruments')

                    if (!uploadRespone) throw Error('업로드 실패')

                    console.log('이미지 업로드 수행완료')
                    const { imageUrl } = uploadRespone;
                    submitForm.imageUrl = imageUrl;
                }

                console.log(submitForm);
                const response = await fetch(`${process.env.BASE_URL}/instrument/${instrument.instrumentId}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(submitForm),
                    signal,
                })

                if (!response.ok) throw Error('Server Error' + response.status)

                showEditCompleteToast();
                navigation.goBack();
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.error('Request was canceled' + err.status);
                } else {
                    console.error(err.message + ' ' + err.status);
                }
            } finally {
                setLoading(false)
                clearTimeout(timeoutId);
            }
        }
        
        editInstrument()
    }

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); dropdownCloseHandler() }} >
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFF" }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
                <View style={{ flex: 1, backgroundColor: `#FFF`, }}>
                    <Modal visible={isLoading} transparent>
                        <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size={'large'} color={'white'}></ActivityIndicator>
                        </View>
                    </Modal>
                    <ScrollView contentContainerStyle={{ alignItems: 'center', flex: 1 }}>
                        <View style={{ height: 12 }} />
                        <Pressable style={styles.imageContainer}
                            onPress={() => {
                                pickImageFromAlbum();
                            }}>

                            {instrument?.imageUrl || selectedImageUri ?
                                <Image
                                    source={{ uri: selectedImageUri || instrument?.imageUrl }}
                                    style={styles.image}
                                />
                                :
                                <View style={[styles.image, { backgroundColor: Color['grey200'] }]} />
                            }


                        </Pressable>
                        <View style={{ height: 28 }} />
                        <View style={styles.Row}>
                            <Text style={styles.RowLeft}>{`악기 이름`}</Text>
                            <TextInput value={instrument.name} onChangeText={chageName} style={[styles.RowRight, { borderBottomWidth: 0.5, paddingBottom: 4 }]} />

                        </View>

                        <View style={{ height: 14 }} />

                        <View style={[styles.Row, { zIndex: -1 }]}>
                            <Text style={styles.RowLeft}>{`악기 타입`}</Text>
                            <Pressable style={{ position: 'relative', zIndex: 0 }}
                                onPress={() => { Keyboard.dismiss(); setSelectTypeVisible(true); }}>
                                <Text style={styles.RowRight}>{instrument.instrumentType}</Text>
                                {
                                    onSelectType &&
                                    <View style={{
                                        position: 'absolute', top: 0, right: 0, zIndex: 2, width: 120, backgroundColor: '#FFF', alignItems: 'flex-start', paddingHorizontal: 16, borderRadius: 5, shadowColor: Color['grey700'],
                                        shadowOffset: { width: -2, height: 2 }, // 그림자 오프셋 (x, y)
                                        shadowOpacity: 0.1,         // 그림자 투명도 (0에서 1)
                                        shadowRadius: 5,          // 그림자 반경
                                        elevation: 5,
                                        height: 180,
                                    }}>
                                        <ScrollView
                                            contentContainerStyle={{ alignItems: 'flex-start' }}
                                            showsVerticalScrollIndicator={false}
                                        >{instrumentTypes.map((item) => {
                                            return (
                                                <Pressable
                                                    key={item + 'seletor'}
                                                    style={{ paddingVertical: 4, marginVertical: 4, width: 120 - 32, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                                                    onPress={() => { setInstrument({ ...instrument, instrumentType: item }); setSelectTypeVisible(false); }}>
                                                    <Text style={[{ fontFamily: "NanumSquareNeo-Regular", fontSize: 16, color: instrument.instrumentType == item ? Color['green600'] : Color['grey400'] }]}>{item}</Text>
                                                    {instrument.instrumentType == item && <Icons name='checkmark' color={Color['green500']} size={24} />}
                                                </Pressable>
                                            )
                                        })}</ScrollView>
                                    </View>
                                }
                            </Pressable>

                        </View>

                    </ScrollView >

                    {instrument.instrumentId != -1 && <>
                        <View style={{ height: 8 }} />
                        <LongButton color='red' innerText='삭제하기' isAble={true} onPress={() => DeleteHandler()} />
                    </>}
                    <View style={{ height: 8 }} />
                    <LongButton color='blue' innerText='저장하기' isAble={true} onPress={() => SubmitHandler()} />
                    <View style={{ height: 8 }} />
                </View >
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default InstrumentEditScreen

const styles = StyleSheet.create({
    card: {
        width: 154,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Color['grey200'],
    },
    imageContainer: {
        overflow: 'hidden',
        width: 308,
        height: 204,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 308,
        height: 204,
    },
    Row: {
        flexDirection: 'row',
        height: 40,
        width: 342,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12
    },
    RowLeft: {
        fontFamily: "NanumSquareNeo-Regular",
        fontSize: 16,
        color: Color['grey400']
    },
    RowRight: {
        width: 120,
        textAlign: 'right',
        fontFamily: "NanumSquareNeo-Regular",
        fontSize: 16,
        color: Color['grey700']
    }
})

