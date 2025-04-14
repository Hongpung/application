import { atom } from "recoil";
import { Member } from "./type";

export const UserStatusState = atom<Member | null>({
    key: 'UserStatusState',
    default: null,
});