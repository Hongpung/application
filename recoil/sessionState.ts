import { RealtimeSession, ReservationSession } from "@hongpung/pages/Reservation/SessionTypes";
import { atom } from "recoil";

export const onUseSession = atom<ReservationSession | RealtimeSession | null>({
    key: 'onUseSession',
    default: null,
});
