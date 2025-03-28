import { atom } from "recoil";
import { DailyReservation } from "./type";

export const myTodayReservationState = atom<DailyReservation[] | null>({
    key: 'myTodayReservationState',
    default: null
})