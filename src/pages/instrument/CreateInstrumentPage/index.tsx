import { StyleSheet, TextInput, Text, View, ScrollView, Image, Modal, Pressable, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, Alert, ActivityIndicator } from 'react-native'
import React from 'react'

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Icons, Color } from '@hongpung/src/common';

import { FullScreenLoadingModal } from '@hongpung/src/common/ui/LoadingModal/FullScreenLoadingModal';

import { ClubInstrumentStackParamList } from '@hongpung/nav/InstrumentStack';

import { useImagePicker } from '@hongpung/src/common/lib/useImagePicker';

import { CreateInstrumentButton } from '@hongpung/src/features/instrument/createInstrument/ui/CreateInstrumentButton/CreateInstrumentButton';
import { InstrumentTypeSelector } from '@hongpung/src/features/instrument/composeInstrument/ui/InstrumentTypeSelector';
import { InstrumentNameInput } from '@hongpung/src/features/instrument/composeInstrument/ui/InstrumentNameInput/InstrumentNameInput';
import { useCreateInstrument } from '@hongpung/src/features/instrument/createInstrument/model/useCreateInstrument';
import { useSelector } from '@hongpung/src/common/lib/useSelector';

type InstrumentCreateNav = NativeStackNavigationProp<ClubInstrumentStackParamList, 'InstrumentCreate'>

const InstrumentEditScreen: React.FC = () => {


    const { pickImageFromAlbum, selectedImage, selectedImageUri } = useImagePicker();
    const { createInstrumentRequest, instrumentType, name, setInstrumentType, setName, isLoading } = useCreateInstrument(selectedImage);

    const [onSelectType, setSelectTypeVisible, closeInstrumentTypeSelector] = useSelector();

    return (
        <TouchableWithoutFeedback
            onPress={() => { Keyboard.dismiss(); closeInstrumentTypeSelector() }} >
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
                                onSelectType={onSelectType}
                                setSelectTypeVisible={setSelectTypeVisible}
                                instrumentType={instrumentType}
                                setInstrumentType={setInstrumentType}
                            />

                        </View>
                    </ScrollView >

                    <View style={styles.buttonContainer} >

                        <CreateInstrumentButton
                            onPress={createInstrumentRequest} />

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

