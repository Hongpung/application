import { atom } from "recoil";
import { Session } from "./type";

export const ThisSessionState = atom<Session|null>({
    key: 'ThisSessionState',
    default: null,
});