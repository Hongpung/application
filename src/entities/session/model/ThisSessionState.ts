import { atom } from "jotai";
import { Session } from "./type";

export const ThisSessionState = atom<Session | null>(null);