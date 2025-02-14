import { getToken } from "../src/common/utils/TokenHandler";

export default async function uploadImage(imageFile: File, toUse: string): Promise<{ imageUrl: string } | null> {
    
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
        console.log('진입')
        const token = await getToken('token')
        if(!token) throw Error('Invalid Token')
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
        return null;
    }finally{
        clearTimeout(timeoutId)
    }
}