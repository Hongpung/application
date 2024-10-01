import { atom } from 'recoil';
import { User } from '../UserType';

// Token 상태 관리 Atom
export const tokenState = atom<string | null>({
  key: 'tokenState', // 전역적으로 고유한 key (중복되지 않도록 설정)
  default: null,
});

// 로그인된 사용자 정보 관리 Atom
export const loginUserState = atom<User | null>({
  key: 'loginUserState',
  default: null,
});
