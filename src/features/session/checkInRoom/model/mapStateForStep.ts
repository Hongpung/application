import {
  CheckInAttendStatus,
  CheckInStartStatus,
  SessionState,
} from "@hongpung/src/entities/session";
import { CheckInStep } from "@hongpung/src/features/session/checkInRoom/model/type";

export const getStepFromSessionData = (
  sessionData: SessionState | null,
  isCheckin: boolean,
  checkinBootStatus: CheckInAttendStatus | CheckInStartStatus | null,
): CheckInStep | null => {
  if (!sessionData) return null;

  // 체크인 완료 후 단계들
  if (isCheckin) {
    if (checkinBootStatus === "지각" && sessionData.status === "JOINABLE") {
      return "LateSessionComplete";
    }
    if (checkinBootStatus === "참가" || checkinBootStatus === "출석") {
      return "AttendSessionComplete";
    }
    return "StartSessionComplete";
  }

  // 체크인 전 확인 단계들
  switch (sessionData.status) {
    case "JOINABLE":
      return sessionData.currentSession ? "AttendSessionConfirm" : null;
    case "STARTABLE":
      return sessionData.nextReservationSession ? "StartSessionConfirm" : null;
    case "CREATABLE":
      return "CreateSessionConfirm";
    default:
      return null;
  }
};
