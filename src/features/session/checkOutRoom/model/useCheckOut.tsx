import { useEffect, useRef, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { useAtomValue, useAtom } from "jotai";

import {
  PhotoFileFormat,
  Alert,
  uploadImageListRequest,
} from "@hongpung/src/common";

import {
  Session,
  ThisSessionState,
  UseRoomState,
  useEndSessionRequest,
} from "@hongpung/src/entities/session";

import { SessionLog } from "@hongpung/src/entities/session-log/@x/session";
import { parsePhotoToFile } from "@hongpung/src/entities/session/lib/parsePhotoToFile";

import { CheckOutStep } from "./types";

export const useCheckOut = () => {
  const navigation = useNavigation();
  const isOnWork = useRef(true);

  // 체크아웃 시 전송할 사진(정리 사진들)
  const [photos, setPhotos] = useState<PhotoFileFormat[]>([]);

  // 체크아웃 완료 후 받은 데이터
  const [endSessionData, setEndSessionData] = useState<SessionLog | null>(null);

  // 체크아웃 페이지 현재 단계
  const [currentStep, setCurrentStep] =
    useState<CheckOutStep>("CheckOutComplete");

  // 현재 세션 정보
  const session = useAtomValue(ThisSessionState) as Session;

  // 현재 연습실 사용 중 여부
  const [isUserUsingRoom, setUserUsingRoom] = useAtom(UseRoomState);

  // 체크아웃 요청 함수
  const { request: endSessionRequest } = useEndSessionRequest();

  // 체크아웃 로딩 여부
  const [isLoading, setIsLoading] = useState(false);

  // 체크아웃 요청 시 요청할 사진 개수
  // 대여 악기 개수 + 2(정리 사진 2장)
  const [demadingPhotoCount, setDemandingPhotoCount] = useState(
    (session?.borrowInstruments?.length || 0) + 2,
  );

  // 세션 정보가 변경되거나 연습실 사용 중 여부가 변경되면 사진 초기화
  useEffect(() => {
    if (session && isUserUsingRoom) {
      if (!isOnWork.current) return;
      setPhotos([]);
      setDemandingPhotoCount((session.borrowInstruments?.length || 0) + 2);
    }
  }, [session, isUserUsingRoom, isOnWork]);

  useEffect(() => {
    if (!isOnWork.current && !isUserUsingRoom) {
      navigation.goBack();
      Alert.alert("세션 만료", "이미 종료된 세션입니다.");
    }
  }, [isUserUsingRoom, navigation]);

  // 체크아웃 요청 함수
  const handleEndSession = async () => {
    try {
      if (!session) throw Error("진행 중인 세션 정보가 없습니다.");
      setIsLoading(true);
      const photoFiles = parsePhotoToFile(photos);
      const { imageUrls } = await uploadImageListRequest(
        photoFiles,
        "end-session",
      );
      const response = await endSessionRequest({
        returnImageUrls: imageUrls,
      });
      console.log("종료 요청 응답:", response);
      const { message, endSessionData: data } = response;

      if (message !== "Fail" && data !== null) {
        setUserUsingRoom(false);
        setEndSessionData(data);
        console.log(data);
      } else {
        throw Error("종료 중 오류가 발생했어요.\n다시 시도해주세요.");
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "진행 중인 세션 정보가 없습니다.") {
          {
            throw e;
          }
        }
      }
      throw new Error("알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    endSession: handleEndSession,
    photos,
    setPhotos,
    session,
    demadingPhotoCount,
    currentStep,
    endSessionData,
    setCurrentStep,
  };
};
