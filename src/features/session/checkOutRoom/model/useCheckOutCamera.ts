import { useRef, useState, useEffect } from "react";
import { CameraView } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { PhotoFileFormat } from "@hongpung/src/common/types/PhotoFileFormat";
import { Session } from "@hongpung/src/entities/session";

interface UseCheckOutCameraProps {
  session: Session;
  photos: PhotoFileFormat[];
  setPhotos: React.Dispatch<PhotoFileFormat[]>;
  onNext: () => void;
}

export const useCheckOutCamera = ({
  session,
  photos,
  setPhotos,
  onNext,
}: UseCheckOutCameraProps) => {
  const isFocusing = useIsFocused();
  const cameraRef = useRef<CameraView | null>(null);
  const shootingCount = (session.borrowInstruments?.length || 0) + 2;

  const takePictureHandler = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.5,
      imageType: "jpg",
    });

    if (photo) {
      setPhotos([
        ...photos,
        {
          uri: photo.uri,
          originHeight: photo.height,
          originWidth: photo.width,
        },
      ]);
    }
  };

  useEffect(() => {
    if (photos.length > 0) setPhotos([]);
  }, [isFocusing]);

  useEffect(() => {
    if (photos.length === shootingCount) onNext();
  }, [photos]);

  return {
    cameraRef,
    takePictureHandler,
    shootingCount,
  };
}; 