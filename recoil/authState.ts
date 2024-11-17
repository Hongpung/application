import { atom } from 'recoil';
import { User } from '@hongpung/UserType';

// 로그인된 사용자 정보 관리 Atom
export const loginUserState = atom<User | null>({
  key: 'loginUserState',
  default: null,
});

// 사용자의 당일 예약 정보
export const todayReservation = atom<any[]>({
  key:'todayReservation',
  default:[]
})

// 사용자의 현재 연습실 사용 정보
export const isOnReserve = atom<boolean>({
  key:'userOnReserve',
  default:false
})