import { RealtimeSession, ReservationSession } from "@hongpung/src/entities/session"
import { Session } from "@hongpung/src/entities/session"

export type SessionState =
    | { status: 'CREATABLE', nextReservationSession: ReservationSession | null }
    | { status: 'STARTABLE', nextReservationSession: ReservationSession }
    | { status: 'JOINABLE', currentSession: ReservationSession | RealtimeSession }
    | { status: 'UNAVAILABLE', errorMessage: string }

export type CheckInAttendStatus = "출석" | "지각" | "참가";
export type CheckInStartStatus = "started" | "created";

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
