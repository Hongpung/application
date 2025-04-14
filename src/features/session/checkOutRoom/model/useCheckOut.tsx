import { ThisSessionState } from "@hongpung/src/entities/session";
import { UseRoomState } from "@hongpung/src/entities/session";
import { uploadImageListRequest } from "@hongpung/src/common/api/uploadImageApi";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { CheckOutStep } from "./types";
import { useEndSessionRequest } from "../api/checkInApi";
import { parsePhotoToFile } from "@hongpung/src/entities/session/lib/parsePhotoToFile";
import { PhotoFileFormat } from "@hongpung/src/common/types/PhotoFileFormat";

export const useCheckOut = () => {
  const navigation = useNavigation();

  const [onStep, setStep] = useState<CheckOutStep>("CheckOutConfirm");
  const [photos, setPhotos] = useState<PhotoFileFormat[]>([]);

  const usingSession = useRecoilValue(ThisSessionState);
  const [useRoomState, setUseRoomState] = useRecoilState(UseRoomState);

  const { request: endSessionRequest, isLoading } = useEndSessionRequest();

  const endSession = async () => {
    try {
      if (!usingSession) throw Error("진행 중인 세션 정보가 없습니다.");

      setStep("CheckOutComplete");

      const photoFiles = parsePhotoToFile(photos);
      const data = await uploadImageListRequest(photoFiles, "end-session");
      const response = await endSessionRequest({
        returnImageUrls: data.imageUrls,
      });

      const { message } = response;

      if (message != "Fail") {
        setUseRoomState(false);
      } else {
        throw Error("종료 중 오류가 발생했어요.\n다시 시도해주세요.");
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.message == "진행 중인 세션 정보가 없습니다.") {
          {
            Alert.alert(e.message);
            navigation.dispatch(StackActions.replace("HomeStack"));
          }
        }
      }
      Alert.alert("종료 중 오류가 발생했어요.\n다시 시도해주세요.");
      setStep("ConfirmPhotos");
    }
  };

  useEffect(() => {
    if (!useRoomState && onStep != "CheckOutComplete") {
      navigation.dispatch(StackActions.replace("HomeStack"));
      Alert.alert("세션 만료", "이미 종료된 세션입니다.");
    }
  }, [useRoomState, onStep]);

  return {
    isLoading,
    endSession,
    onStep,
    setStep,
    photos,
    setPhotos,
    usingSession,
  };
};
