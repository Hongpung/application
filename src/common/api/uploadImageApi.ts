import dayjs from "dayjs";
import { buildApi } from "./apiBuilder";

export async function uploadImageListRequest(
  imageFileList: File[],
  toUse: string,
): Promise<{ imageUrls: string[] }> {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const formData = new FormData();
    const photoFiles = imageFileList;

    if (photoFiles.length === 0) throw new Error("이미지 파일이 없습니다.");

    const todayString = dayjs().toISOString();

    photoFiles.forEach((photo, index) => {
      formData.append("images", photo, `${photo.name}-${todayString}-${index}`); // React Native에서 FormData 파일 처리 방식
    });
    formData.append("path", toUse); // 업로드 경로

    const pictureUpload = await buildApi<{
      uploadUrls: { uploadUrl: string; imageUrl: string }[];
    }>({
      url: `${process.env.EXPO_PUBLIC_BASE_URL}/upload-s3/images`,
      method: "POST",
      withAuthorize: true,
      body: formData,
      options: { signal },
    });

    const {
      uploadUrls,
    }: { uploadUrls: { uploadUrl: string; imageUrl: string }[] } =
      pictureUpload;

    for (let i = 0; i < imageFileList.length; i++) {
      const { uploadUrl } = uploadUrls[i];
      await buildApi({
        url: uploadUrl,
        method: "PUT",
        body: photoFiles[i],
        withAuthorize: false, // S3 pre-signed URL에는 Authorization 헤더가 필요하지 않음
        options: { signal, headers: { "Content-Type": "image/jpeg" } },
      });
    }

    const imageUrls = uploadUrls.map((url) => url.imageUrl);
    return { imageUrls };
  } catch {
    throw new Error("이미지 업로드 실패");
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function uploadImageRequest(
  imageFile: File,
  toUse: string,
): Promise<{ imageUrl: string }> {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const todayString = dayjs().toISOString();
    const formData = new FormData();
    formData.append("image", imageFile, `${imageFile.name}-${todayString}`);
    formData.append("path", toUse);

    const uploadConfirm = await buildApi<{
      uploadUrl: string;
      imageUrl: string;
    }>({
      url: `${process.env.EXPO_PUBLIC_BASE_URL}/upload-s3/image`,
      method: "POST",
      withAuthorize: true,
      body: formData,
      options: { signal },
    });

    const { uploadUrl, imageUrl } = uploadConfirm;

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": imageFile.type,
      },
      body: imageFile,
      signal,
    });

    if (!uploadResponse.ok) throw new Error("Failed to upload image to S3");

    return { imageUrl };
  } catch (error) {
    console.error(error);
    throw new Error("이미지 업로드 실패");
  } finally {
    clearTimeout(timeoutId);
  }
}
