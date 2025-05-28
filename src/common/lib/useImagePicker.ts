import { useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "../atom/alertAtom";
import { Linking } from "react-native";

const MAX_SIZE_IN_MB = 10; // 최대 10MB
const MAX_SIZE_IN_BYTES = MAX_SIZE_IN_MB * 1024 * 1024;

export const useImagePicker = () => {
  const [selectedImage, setImageFile] = useState<File | null>(null);
  const [selectedImageUri, setImageUri] = useState<string | null>(null);

  const isResetImage = useRef(false);

  const resetImage = () => {
    setImageFile(null);
    setImageUri(null);
    isResetImage.current = true;
  };

  const pickImageFromAlbum = async () => {
    // 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "앨범 접근 권한이 필요합니다.", {
        onConfirm: () => {
          Linking.openSettings();
        },
      });
      return;
    }
    // 앨범에서 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true, // 선택 후 편집 가능
      aspect: [1, 1], // 편집 비율 설정 (3:2)
      quality: 0.4, // 이미지 품질 설정 (0 ~ 1) - 조금 더 높은 품질
      exif: false, // EXIF 메타데이터 제거로 파일 크기 감소
      base64: false, // base64 인코딩 방지 (기본값, 파일 크기 최적화)
      allowsMultipleSelection: false, // 단일 선택만 허용
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const imageUri = asset.uri;
      const imageName = imageUri.split("/").pop();
      const imageType = `image/${imageName?.split(".").pop()}`; // MIME 타입 추정

      // 파일 크기 체크 (옵션)
      const fileSize = asset.fileSize; // 바이트 단위
      if (fileSize && fileSize > MAX_SIZE_IN_BYTES) {
        Alert.alert(
          "파일 크기 초과",
          `이미지 크기가 너무 큽니다. (${(fileSize / 1024 / 1024).toFixed(1)}MB)\n최대 ${MAX_SIZE_IN_MB}MB까지 업로드 가능합니다.`,
          {
            confirmText: "확인",
            onConfirm: () => pickImageFromAlbum(), // 다시 선택하도록 유도
          },
        );
        return { imageFile: null, imageUri: null };
      }

      const imageFile = {
        uri: imageUri,
        name: imageName,
        type: imageType,
        size: fileSize, // 파일 크기도 포함
      } as unknown as File;

      console.log(
        `이미지 선택 완료: ${imageName}, 크기: ${fileSize ? (fileSize / 1024 / 1024).toFixed(2) + "MB" : "알 수 없음"}`,
      );
      setImageUri(imageUri);
      setImageFile(imageFile); // 선택된 이미지의 URI 저장

      return { imageFile, imageUri };
    }

    return { imageFile: null, imageUri: null };
  };

  return {
    selectedImage,
    selectedImageUri,
    pickImageFromAlbum,
    resetImage,
    isResetImage,
  };
};
