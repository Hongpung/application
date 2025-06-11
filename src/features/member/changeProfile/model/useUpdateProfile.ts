import { uploadImageRequest, useImagePicker } from "@hongpung/src/common";
import {
  mapProfileUpdateBody,
  Member,
  useUpdateMyStatusRequest,
  UserStatusState,
} from "@hongpung/src/entities/member";

import { useMemo, useState } from "react";
import { changeProfileSuccessToast } from "../lib/changeSuccessToast";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";

export const useUpdateProfile = () => {
  const navigation = useNavigation();
  const {
    pickImageFromAlbum,
    selectedImage,
    selectedImageUri,
    resetImage: pickImageReset,
    isResetImage,
  } = useImagePicker();

  const [currentUserStatus, setUserStatus] = useAtom(UserStatusState);
  if (!currentUserStatus) throw new Error("현재 유저 상태가 없습니다.");
  const [editPersonalInfo, setEditPersonalInfo] =
    useState<Member>(currentUserStatus);
  const { request: updateMyStatus, isLoading } = useUpdateMyStatusRequest();

  const isChanged = useMemo(
    () =>
      JSON.stringify(currentUserStatus) !== JSON.stringify(editPersonalInfo) ||
      !!selectedImageUri,
    [currentUserStatus, editPersonalInfo, selectedImageUri],
  );

  const updateProfile = async (selectedImageUri: File | null) => {
    if (!editPersonalInfo) {
      return;
    }

    try {
      console.log(isResetImage.current);
      //selectedImageUri가 있으면 이미지 업로드, 없으면 기존 이미지 사용
      const { imageUrl: newProfileUrl } = selectedImageUri
        ? await uploadImageRequest(selectedImageUri, "profile")
        : {
            //seletedImage가 없으면 기존 이미지, 기존이미지가 변경 되려면 트리거가 필요
            imageUrl: isResetImage.current
              ? undefined
              : currentUserStatus?.profileImageUrl,
          };

      const body = mapProfileUpdateBody(currentUserStatus, {
        ...editPersonalInfo,
        profileImageUrl: newProfileUrl,
      });

      await updateMyStatus(body);

      setUserStatus((prev) => ({
        ...prev,
        ...editPersonalInfo,
        profileImageUrl: newProfileUrl,
      }));
      //성공시 동작
      changeProfileSuccessToast();
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    editPersonalInfo,
    setEditPersonalInfo,

    updateProfile,
    isLoading,

    isChanged,

    pickImageFromAlbum,
    selectedImage,
    selectedImageUri,
    resetImage: pickImageReset,
  };
};
