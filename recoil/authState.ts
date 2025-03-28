import { atom } from 'recoil';
import { User } from '@hongpung/UserType';

export interface TodayReservation {
  reservationId: number,
  creatorId: number,
  creatorName: string,
  creatorNickname: string,
  date: string,
  startTime: string,
  endTime: string,
  externalCreatorName: string | null,
  participationAvailable: boolean,
  reservationType: string,
  title: string,
  amountOfParticipators: number
}

export interface TodayReservations {
  date: string
  todayReservations: TodayReservation[]
}

// 로그인된 사용자 정보 관리 Atom
export const loginUserState = atom<User | null>({
  key: 'loginUserState',
  default: null,
});

// 사용자의 당일 예약 정보
export const todayReservations = atom<TodayReservations>({
  key: 'todayReservations',
  default: { date: new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0], todayReservations: [] }
})

// 사용자의 현재 연습실 사용 정보
export const useOnReserve = atom<boolean>({
  key: 'userOnReserve',
  default: false
})