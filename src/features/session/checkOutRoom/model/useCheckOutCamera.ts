import { useRef, useEffect, useState } from "react";
import { CameraView } from "expo-camera";
import { PhotoFileFormat } from "@hongpung/src/common/types/PhotoFileFormat";

interface UseCheckOutCameraProps {
  demadingPhotoCount: number;
  setPhotos: React.Dispatch<PhotoFileFormat[]>;
  onNext: () => void;
}

export const useCheckOutCamera = ({
  demadingPhotoCount,
  setPhotos,
  onNext,
}: UseCheckOutCameraProps) => {
  const cameraRef = useRef<CameraView | null>(null);
  const [newPhotos, setNewPhotos] = useState<PhotoFileFormat[]>([]);

  const takePictureHandler = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.5,
      imageType: "jpg",
    });

    if (photo) {
      console.log("촬영된 사진:", photo);
      setNewPhotos((prev) => {
        return [
          ...prev,
          {
            uri: photo.uri,
            originHeight: photo.height,
            originWidth: photo.width,
          },
        ];
      });
    }
  };

  useEffect(() => {
    if (newPhotos.length === demadingPhotoCount) {
      setPhotos(newPhotos);
      onNext();
    }
  }, [newPhotos, demadingPhotoCount, setPhotos, onNext]);

  return {
    cameraRef,
    takePictureHandler,
    photoLength: newPhotos.length,
  };
};
