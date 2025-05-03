import { atom } from "jotai";
import { DailyReservation } from "./type";

export const myTodayReservationState = atom<DailyReservation[] | null>(null);