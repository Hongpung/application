import { atom } from 'recoil';
import { User } from '@hongpung/UserType';

// 로그인된 사용자 정보 관리 Atom
export const loginUserState = atom<User | null>({
  key: 'loginUserState',
  default: null,
});
