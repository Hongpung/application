import { atom } from "recoil";

export const UseRoomState = atom<boolean>({
    key: 'UseRoomState',
    default: false,
});