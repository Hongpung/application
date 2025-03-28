import { atom } from "recoil";
import { User } from "./user";

export const UserStatusState = atom<User | null>({
    key: 'UserStatusState',
    default: null,
});