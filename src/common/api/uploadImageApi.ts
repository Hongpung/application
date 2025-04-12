import { getToken } from "@hongpung/src/common/lib/TokenHandler";

export async function uploadImageListRequest(imageFileList: File[], toUse: string): Promise<{ imageUrls: string[] }> {

    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
        console.log('진입')
        const token = await getToken('token')
        if (!token) throw Error('Invalid Token')

        const formData = new FormData();
        const photoFiles = imageFileList;

        const todayString = new Date().toISOString();

        photoFiles.forEach((photo, index) => {
            formData.append('images', photo, `${photo.name}-${todayString}-${index}-${(new Date).toISOString()}`); // React Native에서 FormData 파일 처리 방식
        });
        formData.append('path', toUse); // 업로드 경로

        const pictureUpload = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/upload-s3/images`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
            },
            body: formData,
            signal
        });

        const { uploadUrls }: { uploadUrls: { uploadUrl: string; imageUrl: string }[] } = await pictureUpload.json()
        console.log(uploadUrls)

        for (let i = 0; i < imageFileList.length; i++) {
            const { uploadUrl } = uploadUrls[i];
            await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'image/jpeg', // MIME 타입 지정
                },
                body: photoFiles[i],
                signal
            });
        }

        const imageUrls = uploadUrls.map(url => (url.imageUrl))
        return { imageUrls }
    } catch {
        throw new Error('이미지 업로드 실패')
    } finally {
        clearTimeout(timeoutId)
    }
}

export async function uploadImageRequest(imageFile: File, toUse: string): Promise<{ imageUrl: string }> {

    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
        console.log('진입')
        const token = await getToken('token')

        if (!token) throw Error('Invalid Token')

        const formData = new FormData();
        formData.append('image', imageFile, `${imageFile.name}-${(new Date).toISOString()}`);
        formData.append('path', toUse);

        const uploadConfirm = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/upload-s3/image`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                },
                body: formData,
                signal
            })

        if (!uploadConfirm.ok) throw Error();

        const { uploadUrl, imageUrl } = await uploadConfirm.json();

        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': imageFile.type,
            },
            body: imageFile,
            signal
        })

        if (!uploadResponse.ok) throw new Error('Failed to upload image to S3');

        return { imageUrl };
    } catch {
        throw new Error('이미지 업로드 실패')
    } finally {
        clearTimeout(timeoutId)
    }
}