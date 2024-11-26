import { RealtimeSession, ReservationSession } from "@hongpung/pages/Reserve/SessionTypes";
import { atom } from "recoil";

export const onUseSession = atom<ReservationSession | RealtimeSession | null>({
    key: 'onUseSession',
    default: null,
});
