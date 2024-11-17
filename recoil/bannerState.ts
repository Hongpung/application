import { atom } from 'recoil';

interface BannerFetchData {
    id: string
    owner: string
    startDate: string //ISOTimeString
    endDate: string //ISOTimeString
    bannerImgUrl: string
    href?: string
}

export const bannersState = atom<{ state: 'BEFORE' | 'PENDING' | 'LOADED' | 'FAILED', value: BannerFetchData[] | null }>({
    key: 'bannersState',
    default: { state: 'BEFORE', value: null },
});