import { PhotoFileFormat } from "@hongpung/src/common/types/PhotoFileFormat";

export const parsePhotoToFile = (photos: PhotoFileFormat[]) => {
  return photos.map((photo) => {
    const imageUri = photo.uri;
    const imageName = imageUri.split("/").pop();
    const imageType = `image/${imageName?.split(".").pop()}`;

    const imageFile = {
      uri: imageUri,
      name: imageName,
      type: imageType,
    } as unknown as File;

    return imageFile;
  });
};
