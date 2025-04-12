import { StyleSheet, TextInput, Text, View, ScrollView, Image, Modal, Pressable, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Toast from 'react-native-toast-message';

import { Icons, Selector, Color } from '@hongpung/src/common';

import { FullScreenLoadingModal } from '@hongpung/src/common/ui/LoadingModal/FullScreenLoadingModal';

import { ClubInstrumentStackParamList } from '@hongpung/nav/InstrumentStack';

import { uploadImageRequest } from '@hongpung/src/common/api/uploadImageApi';
import { useImagePicker } from '@hongpung/src/common/lib/useImagePicker';

import { type InstrumentType } from '@hongpung/src/entities/instrument';
import { instrumentTypes } from '@hongpung/src/entities/instrument/constant/instrumentTypes';

import { useCreateInsrumentRequest } from '@hongpung/src/features/instrument/createInstrument/api/createInstrumentApi';
import { InstrumentCreateBody } from '@hongpung/src/features/instrument/createInstrument/api/type';
import { CreateInstrumentButton } from '@hongpung/src/features/instrument/createInstrument/ui/CreateInstrumentButton/CreateInstrumentButton';
import { InstrumentTypeSelector } from '@hongpung/src/features/instrument/composeInstrument/ui/InstrumentTypeSelector';
import { InstrumentNameInput } from '@hongpung/src/features/instrument/composeInstrument/ui/InstrumentNameInput/InstrumentNameInput';

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

    

    const navigation = useNavigation<InstrumentCreateNav>();

    const [onSelectType, setSelectTypeVisible] = useState(false);


    const { request: createInstrumentRequest, isLoading } = useCreateInsrumentRequest();


    const dropdownCloseHandler = () => {
        if (onSelectType)
            setSelectTypeVisible(false)
    }


    const { pickImageFromAlbum, selectedImage, selectedImageUri } = useImagePicker();
    
    const [name, setName] = useState('')
    const [instrumentType, setInstrumentType] = useState<InstrumentType | null>(null);

    const SubmitHandler = () => {

        const createInstrument = async () => {

            try {

                if (instrumentType === null) {
                    Alert.alert('오류', '악기 종류를 선택해주세요.')
                    return;
                }

                const submitForm: InstrumentCreateBody = { name: name, instrumentType: instrumentType }

                if (!!selectedImage) {

                    console.log('이미지 업로드 수행중')
                    const uploadRespone = await uploadImageRequest(selectedImage, 'instruments')

                    if (!uploadRespone) throw Error('업로드 실패')

                    console.log('이미지 업로드 수행완료')
                    const { imageUrl } = uploadRespone;
                    submitForm.imageUrl = imageUrl;

                }

                const response = await createInstrumentRequest(submitForm)
                const { instrumentId } = response;

                showCreateCompleteToast();
                navigation.replace('InstrumentSpecific', { instrumentId });

            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.error('Request was canceled' + err.status);
                } else {
                    console.error(err.message + ' ' + err.status);
                }
            }
        }

        createInstrument();

    }


    return (
        <TouchableWithoutFeedback
            onPress={() => { Keyboard.dismiss(); dropdownCloseHandler() }} >
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>

                <View style={styles.container}>

                    <FullScreenLoadingModal isLoading={isLoading} />

                    <ScrollView contentContainerStyle={styles.scrollView} bounces={false}>

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
                                <View style={styles.imagePlaceholder} >
                                    <Icons name='add' size={64} color={Color['grey400']}></Icons>
                                    <Text style={styles.imagePlaceholderText}>이미지를 추가할 수 있어요</Text>
                                </View>
                            }

                        </Pressable>

                        <View style={{ height: 28 }} />

                        <View style={styles.inputContainer}>

                            <InstrumentNameInput
                                name={name}
                                setName={setName} />

                            <InstrumentTypeSelector
                                setSelectTypeVisible={setSelectTypeVisible}
                                onSelectType={onSelectType}
                                instrumentType={instrumentType}
                                setInstrumentType={setInstrumentType}
                            />

                        </View>
                    </ScrollView >

                    <View style={styles.buttonContainer} >

                        <CreateInstrumentButton
                            onPress={() => { }} />

                    </View>
                </View >

            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}


export default InstrumentEditScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    keyboardAvoidingView: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    scrollView: {
        alignItems: 'center',
        flex: 1,
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
    imagePlaceholder: {
        backgroundColor: Color['grey200'],
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        width: 308,
        height: 204,
        borderRadius: 10,
    },
    imagePlaceholderText: {
        fontFamily: "NanumSquareNeo-Bold",
        fontSize: 14,
        color: Color['grey400'],
    },
    inputContainer: {
        flexDirection: 'column',
        gap: 12,
        paddingVertical: 24,
    },
    buttonContainer: {
        paddingVertical: 8,
    },
    card: {
        width: 154,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Color['grey200'],
    },
    Row: {
        flexDirection: 'row',
        height: 40,
        width: 342,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    RowLeft: {
        fontFamily: "NanumSquareNeo-Regular",
        fontSize: 16,
        color: Color['grey400'],
    },
    RowRight: {
        width: 80,
        textAlign: 'right',
        fontFamily: "NanumSquareNeo-Regular",
        fontSize: 16,
        color: Color['grey700'],
    },
});

