import { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";
import { useAtomValue, useAtom } from "jotai";
import { UserStatusState } from "@hongpung/src/entities/member";
import { UseRoomState } from "@hongpung/src/entities/session";
import {
  CheckInAttendStatus,
  CheckInStartStatus,
} from "@hongpung/src/features/session/checkInRoom/model/type";
import {
  useCheckInPossibilityFetch,
  useStartSessionRequest,
  useAttendSessionRequest,
} from "@hongpung/src/features/session/checkInRoom/api/checkInApi";
import { Alert } from "react-native";
import { isLoading } from "expo-font";
import AttendSessionCompleteWidget from "@hongpung/src/widgets/session/ui/AttendSessionCompleteWidget/AttendSessionCompleteWidget";
import { AttendSessionConfirmWidget } from "@hongpung/src/widgets/session/ui/AttendSessionConfirmWidget/AttendSessionConfirmWidget";
import { CreateSessionConfirmWidget } from "@hongpung/src/widgets/session/ui/CreateSessionConfirmWidget/CreateSessionConfirmWidget";
import LateSessionCompleteWidget from "@hongpung/src/widgets/session/ui/LateSessionCompleteWidget/LateSessionCompleteWidget";
import StartSessionCompleteWidget from "@hongpung/src/widgets/session/ui/StartSessionCompleteWidget/StartSessionCompleteWidget";
import { StartSessionConfirmWidget } from "@hongpung/src/widgets/session/ui/StartSessionConfirmWidget/StartSessionConfirmWidget";

export const useCheckIn = () => {
  const navigation = useNavigation();

  const loginUser = useAtomValue(UserStatusState);
  const [usingRoom, setUseRoom] = useAtom(UseRoomState);
  const [isCheckin, setIsCheckin] = useState(false);

  const [checkinStatus, setCheckinStatus] = useState<
    CheckInAttendStatus | CheckInStartStatus | null
  >(null);
  const [participationAvailable, setParticipationAvailable] = useState(false);

  const { data: sessionData, isLoading } = useCheckInPossibilityFetch();
  const { request: startSession } = useStartSessionRequest();
  const { request: attendSession } = useAttendSessionRequest();

  const handleStartSession = async () => {
    try {
      if (!loginUser) throw new Error("유저 정보가 없습니다.");

      const response = await startSession({ participationAvailable });
      if (response === "failed") throw new Error("연습 시작에 실패했습니다.");
      setCheckinStatus(response);
      setIsCheckin(true);

      if (response) {
        setUseRoom(true);
      }
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert("오류", e.message);
      } else {
        Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const handleAttendSession = async () => {
    try {
      if (!loginUser) throw new Error("유저 정보가 없습니다.");

      const response = await attendSession();
      setCheckinStatus(response);
      setIsCheckin(true);

      if (response) {
        setUseRoom(true);
      }
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert("오류", e.message);
      } else {
        Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const handleConfirm = () => {
    navigation.goBack();
  };

  const content = useMemo(() => {
    if (!sessionData) return null;

    if (isCheckin) {
      if (checkinStatus === "지각" && sessionData.status === "JOINABLE") {
        return (
          <LateSessionCompleteWidget
            startTime={sessionData.currentSession.startTime}
          />
        );
      }
      if (checkinStatus === "참가" || checkinStatus === "출석") {
        return <AttendSessionCompleteWidget attendanceStatus={checkinStatus} />;
      }
      return <StartSessionCompleteWidget />;
    }

    if (sessionData.status === "JOINABLE" && sessionData.currentSession) {
      return (
        <AttendSessionConfirmWidget session={sessionData.currentSession} />
      );
    }

    if (
      sessionData.status === "STARTABLE" &&
      sessionData.nextReservationSession
    ) {
      return (
        <StartSessionConfirmWidget
          session={sessionData.nextReservationSession}
        />
      );
    }

    if (sessionData.status === "CREATABLE") {
      return (
        <CreateSessionConfirmWidget
          nextSession={sessionData.nextReservationSession}
          participationAvailable={participationAvailable}
          onParticipationAvailableChange={setParticipationAvailable}
        />
      );
    }

    return null;
  }, [isCheckin, checkinStatus, sessionData, participationAvailable]);

  const buttonAction = () => {
    if (!sessionData) return () => null;

    if (isCheckin) {
      return handleConfirm;
    }

    if (sessionData.status === "JOINABLE") {
      return handleAttendSession;
    }

    return handleStartSession;
  };

  const errorMessage = useMemo(() => {
    if (usingRoom) return "이미 참여중인 세션입니다.";
    if (sessionData?.status === "UNAVAILABLE")
      return sessionData?.errorMessage ?? "알 수 없는 오류가 발생했습니다.";
    return "알 수 없는 오류가 발생했습니다.";
  }, [usingRoom, sessionData]);

  return {
    usingRoom,

    sessionData,
    isLoading,
    isCheckin,
    handleConfirm,

    content,
    errorMessage,
    
    buttonAction,
  };
};
