import { atom } from "recoil";
import { Banner } from "./type";

export const bannersState = atom<Banner[] | null>({
    key: 'bannersState',
    default: null,
});