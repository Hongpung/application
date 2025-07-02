import {
  RealtimeSession,
  ReservationSession,
  SessionState,
  CheckInAttendStatus,
  CheckInStartStatus,
  Session,
} from "@hongpung/src/entities/session";

// Re-export하여 호환성 유지
export type { SessionState, CheckInAttendStatus, CheckInStartStatus };

export interface ReservationSessionWidgetProps {
  session: Session;
  onStart: () => void;
}

export interface CurrentSessionWidgetProps {
  session: Session;
  onAttend: () => void;
}

export interface RealtimeSessionWidgetProps {
  nextSession: Session | null;
  participationAvailable: boolean;
  onParticipationChange: (value: boolean) => void;
  onStart: () => void;
}

// CheckIn Step-Flow 타입들
export type CheckInSteps = {
  StartSessionConfirm: StartSessionConfirmStepProps;
  AttendSessionConfirm: AttendSessionConfirmStepProps;
  CreateSessionConfirm: CreateSessionConfirmStepProps;
  StartSessionComplete: StartSessionCompleteStepProps;
  AttendSessionComplete: AttendSessionCompleteStepProps;
  LateSessionComplete: LateSessionCompleteStepProps;
};

export type CheckInStep = keyof CheckInSteps;

export interface StartSessionConfirmStepProps {
  session: ReservationSession | RealtimeSession | null;
  participationAvailable: boolean;
  setParticipationAvailable: (value: boolean) => void;
  onStart: () => void;
}

export interface AttendSessionConfirmStepProps {
  session: ReservationSession | RealtimeSession | null;
  onAttend: () => void;
}

export interface CreateSessionConfirmStepProps {
  nextSession: ReservationSession | null;
  participationAvailable: boolean;
  setParticipationAvailable: (value: boolean) => void;
  onStart: () => void;
}

export interface StartSessionCompleteStepProps {
  navigateToHome: () => void;
}

export interface AttendSessionCompleteStepProps {
  attendanceStatus: CheckInAttendStatus;
  navigateToHome: () => void;
}

export interface LateSessionCompleteStepProps {
  startTime: string | null;
  navigateToHome: () => void;
}
