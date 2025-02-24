import { StyleSheet, TextInput, Text, View, ScrollView, Image, Modal, Pressable, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, TextInputChangeEventData, NativeSyntheticEvent, FlatList, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Color } from '../../../../ColorSet';
import { Instrument, InstrumentCreateDTO, InstrumentType, instrumentTypes } from '../../../../UserType';
import LongButton from '../../../../src/common/components/buttons/long-button';
import { useRecoilValue } from 'recoil';
import { loginUserState } from '@hongpung/recoil/authState';
import { Icons } from '@hongpung/src/common/components/icons/Icon';
import { getToken } from '@hongpung/src/common/lib/TokenHandler';
import Toast from 'react-native-toast-message';
import uploadImages from '@hongpung/utils/uploadImage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClubInstrumentStackParamList } from '@hongpung/nav/InstrumentStack';
import * as ImagePicker from 'expo-image-picker';
import { DropDown } from '@hongpung/src/common/components/selector/Selector';

const showCreateCompleteToast = () => {
    Toast.show({
        type: 'success',
        text1: '악기 등록을 완료했어요!',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 2000
    });
};

type InstrumentCreateNav = NativeStackNavigationProp<ClubInstrumentStackParamList, 'InstrumentCreate'>

const InstrumentEditScreen: React.FC = () => {


    const loginUser = useRecoilValue(loginUserState);

    const navigation = useNavigation<InstrumentCreateNav>();

    const [instrumentsEngType] = useState(['KKWANGGWARI', 'JANGGU', 'BUK', 'SOGO', 'JING', 'ETC'])

    const [selectedImage, setImageFile] = useState<File | null>(null);
    const [selectedImageUri, setImageUri] = useState<string | null>(null);

    const [onSelectType, setSelectTypeVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [instrument, setInstrument] = useState<Instrument>({ borrowAvailable: true, club: loginUser?.club == '기타' ? '들녘' : loginUser?.club!, borrowHistory: [], name: '', instrumentId: -1, instrumentType: '꽹과리' })


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


    const SubmitHandler = () => {
        const createInstrument = async () => {

            console.log(`신규 생성`)
            const controller = new AbortController();
            const signal = controller.signal;
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {
                setLoading(true)
                const token = await getToken('token');

                if (!token) throw Error('invalid Token');

                const submitForm: InstrumentCreateDTO = { name: instrument.name, instrumentType: instrument.instrumentType }

                if (!!selectedImage) {
                    console.log('이미지 업로드 수행중')
                    const uploadRespone = await uploadImages(selectedImage, 'instruments')

                    if (!uploadRespone) throw Error('업로드 실패')

                    console.log('이미지 업로드 수행완료')
                    const { imageUrl } = uploadRespone;
                    submitForm.imageUrl = imageUrl;
                }


                console.log('신규 악기 생성 수행중', submitForm)
                const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/instrument/create`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(submitForm),
                    signal
                })

                console.log('신규 악기 생성 수행')
                if (!response.ok) throw Error('Server Error' + response.status)

                navigation.replace('InstrumentsHome');

            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.error('Request was canceled' + err.status);
                } else {
                    console.error(err.message + ' ' + err.status);
                }
            } finally {
                showCreateCompleteToast();
                clearTimeout(timeoutId);
                setLoading(false)
            }

        }

        createInstrument();
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
                    <ScrollView contentContainerStyle={{ alignItems: 'center', flex: 1 }} bounces={false}>
                        <View style={{ height: 12 }} />
                        <Pressable style={styles.imageContainer}
                            onPress={() => {
                                pickImageFromAlbum();
                            }}>
                            {selectedImageUri ?
                                <Image
                                    source={{ uri: selectedImageUri }}
                                    style={styles.image}
                                />
                                :
                                <View style={[styles.image, { backgroundColor: Color['grey200'], alignItems: 'center', justifyContent: 'center', gap: 16 }]} >
                                    <Icons name='add' size={64} color={Color['grey400']}></Icons>
                                    <Text style={{ fontFamily: "NanumSquareNeo-Bold", fontSize: 14, color: Color['grey400'] }}>이미지를 추가할 수 있어요</Text>
                                </View>
                            }
                        </Pressable>
                        <View style={{ height: 28 }} />

                        <View style={{ flexDirection: 'column', gap: 12, paddingVertical: 24 }}>

                            <View style={styles.Row}>
                                <Text style={styles.RowLeft}>{`악기 이름`}</Text>
                                <TextInput value={instrument.name} onChangeText={chageName} style={[styles.RowRight, { borderBottomWidth: 0.5, paddingBottom: 4 }]} />

                            </View>


                            <View style={[styles.Row, { zIndex: 1 }]}>
                                <Text style={styles.RowLeft}>{`악기 타입`}</Text>
                                <DropDown
                                    label='악기 종류'
                                    setVisible={setSelectTypeVisible}
                                    onChange={(value) => setInstrument(prev => ({ ...prev, instrumentType: value as InstrumentType }))}
                                    options={instrumentTypes}
                                    trigger={Pressable}
                                    visible={onSelectType}
                                    value={instrument.instrumentType}
                                    color='blue'
                                    align='right'
                                >
                                    <Text style={[styles.RowRight, { width: 120 }]}>{instrument.instrumentType}</Text>
                                </DropDown>

                            </View>
                        </View>

                    </ScrollView >

                    <View style={{ height: 8 }} />
                    <LongButton color='blue' innerText='생성하기' isAble={true} onPress={() => SubmitHandler()} />
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
        width: 80,
        textAlign: 'right',
        fontFamily: "NanumSquareNeo-Regular",
        fontSize: 16,
        color: Color['grey700']
    }
})

