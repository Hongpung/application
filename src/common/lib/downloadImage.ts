import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "../atom/alertAtom";

export const confirmAndDownloadImage = (imageUrl: string) => {
  Alert.confirm("이미지 저장", "이 이미지를 저장하시겠습니까?", {
    onConfirm: () => downloadImage(imageUrl),
    confirmText: "저장",
    cancelText: "취소",
    cancelable: true,
  });
};

async function downloadImage(imageUrl: string) {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 오류", "갤러리 저장 권한이 필요합니다.");
      return;
    }

    // URL에서 파일 확장자 추출
    const getFileExtension = (url: string): string => {
      const urlParts = url.split(".");
      const extension = urlParts[urlParts.length - 1].split("?")[0]; // 쿼리 파라미터 제거
      return ["jpg", "jpeg", "png", "gif", "webp"].includes(
        extension.toLowerCase(),
      )
        ? extension.toLowerCase()
        : "jpg"; // 기본값
    };

    const fileExtension = getFileExtension(imageUrl);
    const fileName = `image_${Date.now()}.${fileExtension}`;
    const fileUri = FileSystem.documentDirectory + fileName;

    const downloadResumable = FileSystem.createDownloadResumable(
      imageUrl,
      fileUri,
    );

    const downloadResult = await downloadResumable.downloadAsync();

    if (!downloadResult) {
      Alert.alert("오류", "이미지 다운로드에 실패했습니다.");
      return;
    }

    const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
    const album = await MediaLibrary.getAlbumAsync("홍풍");
    if (!album) {
      await MediaLibrary.createAlbumAsync("홍풍", asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album);
    }

    Alert.alert("완료", "이미지가 저장되었습니다.");
  } catch (error) {
    console.error(error);
    Alert.alert("오류", "저장 중 문제가 발생했습니다.");
  }
}
