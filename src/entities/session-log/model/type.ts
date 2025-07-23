import {
  RealtimeSession,
  ReservationSession,
} from "../../session/@x/session-log";

export type SessionLog =
  | (RealtimeSession & {
      forceEnd: boolean;
      returnImageUrl: string[];
    })
  | (ReservationSession & {
      forceEnd: boolean;
      returnImageUrl: string[];
    });
