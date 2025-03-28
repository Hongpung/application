import { atom } from 'recoil';

import { TimeFormat } from '@hongpung/src/common';
import { Instrument } from '@hongpung/src/entities/instrument';
import { User } from '@hongpung/src/entities/user';

// 예약 제목
export const titleState = atom<string>({
    key: 'titleState',
    default: '',
});

// 예약 날짜 (yyyy-mm-dd 형식)
export const dateState = atom<string | null>({
    key: 'dateState',
    default: null,
});

// 예약 시작 시간 (hh:mm 형식)
export const startTimeState = atom<TimeFormat | null>({
    key: 'startTimeState',
    default: null,
});

// 예약 종료 시간 (hh:mm 형식)
export const endTimeState = atom<TimeFormat | null>({
    key: 'endTimeState',
    default: null,
});

// 예약 타입 (예: COMMON, PREMIUM 등)
export const reservationTypeState = atom<Exclude<ReservationType, 'EXTERNAL'>>({
    key: 'reservationTypeState',
    default: 'REGULAR', // 기본값 설정
});

// 참여 가능 여부
export const participationAvailableState = atom<boolean>({
    key: 'participationAvailableState',
    default: false,
});

// 참여자 목록 (User[])
export const participatorsState = atom<User[]>({
    key: 'participatorsState',
    default: [],
});

// 빌릴 악기 목록 (Instrument[])
export const borrowInstrumentsState = atom<Instrument[]>({
    key: 'borrowInstrumentsState',
    default: [],
});