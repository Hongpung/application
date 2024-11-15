export default async function uploadImages(imageFile: File, toUse: string): Promise<string | null> {
    try {
        const formData = new FormData();
        formData.append('image', imageFile, `${imageFile.name}-${(new Date).toISOString()}`);
        formData.append('path', toUse);

        const uploadConfirm = await fetch(`${process.env.WEB_API}/upload-image`, {
            method: 'POST',
            body: formData
        })
        if (!uploadConfirm.ok) throw Error();

        const { uploadUrl, imageUrl } = await uploadConfirm.json();

        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': imageFile.type,
            },
            body: imageFile,
        })

        if (!uploadResponse.ok) throw new Error('Failed to upload image to S3');

        return imageUrl;
    } catch {
        return null;
    }
}