// Types
import {
  type Session,
  type RealtimeSession,
  type ReservationSession,
  type EmptyCard,
  type SessionCard as SessionCardType,
  type ScheduleCard,
  type SessionState,
  type CheckInAttendStatus,
  type CheckInStartStatus,
} from "./model/type";

// States
import { ThisSessionState } from "./model/ThisSessionState";
import { UseRoomState } from "./model/UseRoomState";

// Lib functions
import { isEmpty } from "./lib/isEmptySession";
import { isOpen } from "./lib/isRoomOpen";
import { timeToDate } from "./lib/timeToDate";
import { useSessionColor } from "./lib/useSessionColor";
import { useAttendanceData } from "./lib/useAttendanceData";

// UI Components
import EmptySessionCard from "./ui/EmptySessionCard/EmptySessionCard";
import SessionCard from "./ui/SessionCard/SessionCard";
import NoScheduleCard from "./ui/NoScheduleCard/NoScheduleCard";
import { SessionLogCard } from "../session-log/ui/SessionLogCard/SessionLogCard";
import { SessionImageGallery } from "../session-log/ui/SessionImageGallery/SessionImageGallery";
import { SessionInfoSummary } from "../session-log/ui/SessionInfoSummary/SessionInfoSummary";
import { AttendanceSummary } from "./ui/AttendanceSummary/AttendanceSummary";

// API
import {
  useExtendSessionRequest,
  useUserUseRoomFetch,
  // CheckIn 관련 API 추가
  useCheckInPossibilityFetch,
  useStartSessionRequest,
  useAttendSessionRequest,
  useEndSessionRequest,
} from "./api/sessionApi";

export {
  // Types
  type Session,
  type RealtimeSession,
  type ReservationSession,
  type EmptyCard,
  type SessionCardType,
  type ScheduleCard,

  // CheckIn 관련 타입들
  type SessionState,
  type CheckInAttendStatus,
  type CheckInStartStatus,

  // States
  ThisSessionState,
  UseRoomState,

  // Lib functions
  isEmpty,
  isOpen,
  timeToDate,
  useSessionColor,
  useAttendanceData,

  // UI Components
  EmptySessionCard,
  SessionCard,
  NoScheduleCard,
  SessionLogCard,
  SessionImageGallery,
  SessionInfoSummary,
  AttendanceSummary,
  // API
  useExtendSessionRequest,
  useUserUseRoomFetch,
  // CheckIn 관련 API
  useCheckInPossibilityFetch,
  useStartSessionRequest,
  useAttendSessionRequest,
  useEndSessionRequest,
};
