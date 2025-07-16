import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAtomValue, useAtom } from "jotai";

import { Alert } from "@hongpung/src/common";

import { UserStatusState } from "@hongpung/src/entities/member";
import {
  UseRoomState,
  useCheckInPossibilityFetch,
  useStartSessionRequest,
  useAttendSessionRequest,
} from "@hongpung/src/entities/session";

import type {
  CheckInAttendStatus,
  CheckInStartStatus,
  CheckInStep,
} from "./type";
import { getStepFromSessionData } from "./mapStateForStep";

export const useCheckIn = () => {
  const navigation = useNavigation();

  const loginUser = useAtomValue(UserStatusState);
  const [usingRoom, setUseRoom] = useAtom(UseRoomState);
  const [isCheckin, setIsCheckin] = useState(false);

  const [checkinAttendStatus, setCheckinAttendStatus] =
    useState<CheckInAttendStatus | null>(null);
  const [checkinBootStatus, setCheckinBootStatus] =
    useState<CheckInStartStatus | null>(null);
  const [currentStep, setCurrentStep] = useState<CheckInStep | null>(null);
  const [participationAvailable, setParticipationAvailable] = useState(false);

  const { data: sessionData, isLoading } = useCheckInPossibilityFetch();
  const { request: startSession } = useStartSessionRequest();
  const { request: attendSession } = useAttendSessionRequest();

  // Step 관리를 위한 helper 함수

  // Step 관리
  useEffect(() => {
    if (!sessionData) return;
    const newStep = getStepFromSessionData(
      sessionData,
      isCheckin,
      checkinBootStatus,
    );
    setCurrentStep(newStep);
  }, [sessionData, isCheckin, checkinBootStatus]);

  const handleStartSession = useCallback(async () => {
    try {
      if (!loginUser) throw new Error("유저 정보가 없습니다.");

      const { status } = await startSession({ participationAvailable });
      if (status === "failed") {
        throw new Error("연습 시작에 실패했습니다.");
      }

      console.log("handleStartSession response", status);
      setCheckinBootStatus(status);
      setIsCheckin(true);
      setUseRoom(true);

      console.log("handleStartSession currentStep", currentStep);
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert("오류", e.message);
      } else {
        Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
      }
    }
  }, [
    loginUser,
    startSession,
    participationAvailable,
    setUseRoom,
    currentStep,
  ]);

  const handleAttendSession = useCallback(async () => {
    try {
      if (!loginUser) throw new Error("유저 정보가 없습니다.");

      const { status } = await attendSession();
      setCheckinAttendStatus(status);
      setIsCheckin(true);

      if (status !== null) {
        setUseRoom(true);
      }
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert("오류", e.message);
      } else {
        Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
      }
    }
  }, [loginUser, attendSession, setUseRoom]);

  const handleConfirm = () => {
    navigation.goBack();
  };

  const buttonHandler = useCallback(
    (navigateToHome: () => void) => {
      if (isCheckin) {
        navigateToHome();
      } else if (
        currentStep === "StartSessionConfirm" ||
        currentStep === "CreateSessionConfirm"
      ) {
        handleStartSession();
      } else if (currentStep === "AttendSessionConfirm") {
        handleAttendSession();
      }
    },
    [isCheckin, currentStep, handleStartSession, handleAttendSession],
  );

  const errorMessage = useMemo(() => {
    if (usingRoom) return "이미 참여중인 세션입니다.";
    if (sessionData?.status === "UNAVAILABLE")
      return sessionData?.errorMessage ?? "알 수 없는 오류가 발생했습니다.";
    return "알 수 없는 오류가 발생했습니다.";
  }, [usingRoom, sessionData]);

  return {
    // 기본 상태
    usingRoom,
    sessionData,
    isLoading,
    isCheckin,
    checkinAttendStatus,
    checkinBootStatus,
    participationAvailable,
    setParticipationAvailable,

    // Step-Flow
    currentStep,

    // 액션들
    handleStartSession,
    handleAttendSession,
    handleConfirm,
    buttonHandler,
    errorMessage,
  };
};
