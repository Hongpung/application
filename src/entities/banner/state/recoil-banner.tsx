import { atom } from "recoil";
import { BannerDto } from "../model/banner-dto";

type BannerFetchStatus = | {
    status: 'BEFORE' | 'PENDING' | 'FAILED',
    value: null
} | {
    status: 'LOADED',
    value: BannerDto[]
}

export const bannersState = atom<BannerFetchStatus>({
    key: 'bannersState',
    default: { status: 'BEFORE', value: null },
});

export default bannersState;