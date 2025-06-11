import { atom } from "jotai";
import { Member } from "./type";

export const UserStatusState = atom<Member | null>(null);
