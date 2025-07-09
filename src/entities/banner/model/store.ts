import { atom } from "jotai";
import { Banner } from "./type";

export const bannersState = atom<Banner[] | null>(null);
