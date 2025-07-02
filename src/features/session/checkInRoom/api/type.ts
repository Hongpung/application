import {
  RealtimeSession,
  ReservationSession,
} from "@hongpung/src/entities/session";

export type SessionState =
  | { status: "CREATABLE"; nextReservationSession: ReservationSession | null }
  | { status: "STARTABLE"; nextReservationSession: ReservationSession }
  | { status: "JOINABLE"; currentSession: ReservationSession | RealtimeSession }
  | { status: "UNAVAILABLE"; errorMessage: string };

export type CheckInAttendStatus = "출석" | "지각" | "참가";
export type CheckInStartStatus = "created" | "started" | "failed";
