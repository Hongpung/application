import { atom } from "recoil";
import { BannerDto } from "../type";

export const bannersState = atom<{ status: 'BEFORE' | 'PENDING' | 'LOADED' | 'FAILED', value: BannerDto[] | null }>({
    key: 'bannersState',
    default: { status: 'BEFORE', value: null },
});

export default bannersState;