import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Alert } from "../atom/alertAtom";
import { Linking } from "react-native";

export const useImagePicker = () => {
    const [selectedImage, setImageFile] = useState<File | null>(null);
    const [selectedImageUri, setImageUri] = useState<string | null>(null);

    const pickImageFromAlbum = async () => {
        // 권한 요청
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('권한 필요', '앨범 접근 권한이 필요합니다.', {
                onConfirm: () => {
                    Linking.openSettings();
                }
            });
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

    return { selectedImage, selectedImageUri, pickImageFromAlbum }
}