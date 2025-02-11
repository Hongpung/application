import { useRecoilState, useSetRecoilState } from 'recoil';
import { loginUserState, TodayReservation, todayReservations, useOnReserve } from '@hongpung/recoil/authState';
import { User } from '@hongpung/UserType';
import { deleteToken, getToken, saveToken } from '@hongpung/utils/TokenHandler';

import { StackActions, useNavigation } from '@react-navigation/native';
import { useNotificationSetting } from './useNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [loginUser, setLoginUser] = useRecoilState(loginUserState);
  const setOnSession = useSetRecoilState(useOnReserve);
  const setTodayReservation = useSetRecoilState(todayReservations);
  const controller = new AbortController();
  const signal = controller.signal;

  const { turnOffNotification, turnOnNotification } = useNotificationSetting();

  const initAppFetchUser = async () => {

    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const token = await getToken('token');

      if (token) {
        const loadUser = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/member/my-status`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        )

        if (!loadUser.ok) throw Error('유저 정보 로드 실패')
        const userStatus = await loadUser.json() as User;

        if (!userStatus) throw Error('유저 정보가 비어 있음')


        setLoginUser(userStatus);

        const pushOption = await AsyncStorage.getItem('receive-push');

        if (pushOption === 'true')
          turnOnNotification();

        const useSession = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/session/is-checkin`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        })

        if (!useSession.ok) throw Error('세션 불러오기 실패')

        const { isCheckin } = await useSession.json()

        if (isCheckin == true) {
          console.log('세션 연겨룀')
          setOnSession(true)
        }

        const todayReservations = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/reservation/today`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        })

        if (!todayReservations.ok) throw Error('오늘 예약 불러오기 실패')

        const loadedReservations = await todayReservations.json() as TodayReservation[]

        if (!!loadedReservations) {
          setTodayReservation(prev => ({ ...prev, todayReservations: [...loadedReservations] }))
        }

      }
    } catch (e) {
      console.error(e);
      // navigation.dispatch(StackActions.replace('Login'))
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const loadUserState = async () => {
    const navigation = useNavigation()
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const token = await getToken('token');

      if (token) {
        const loadUser = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/member/status`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
            }
          }
        )
        if (!loadUser.ok) throw Error('유저 정보 로드 실패')

        const userStatus = await loadUser.json() as User;

        setLoginUser(userStatus);
      }
    } catch (e) {
      console.error(e);
      navigation.dispatch(StackActions.replace('Login'))
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const login = async (email: string, password: string, autoLogin: boolean = false): Promise<boolean> => {
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const loginData = { email, password, autoLogin };

      console.log(JSON.stringify(loginData))
      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
        signal,
      });

      if (!response.ok) {
        const { message } = await response.json();

        throw new Error(message);
      }


      const result = await response.json();

      if (result.token) {
        const { token } = result;

        await saveToken('token', token);

        await initAppFetchUser();
        // Recoil 상태 업데이트
        return true;
      }
    } catch (error) {
      if (error instanceof Error)
        throw error;
      else
        return false;
    } finally {
      clearTimeout(timeoutId);
    }
    return false;
  };


  const logout = async () => {
    try {
      if (!loginUser) console.log('유저 정보가 없음')

      turnOffNotification();

      await deleteToken('token');

      setLoginUser(null);
    }
    catch (e) {
      throw Error('failed to delete Expo Token')
    }
  };

  return {
    loginUser,
    login,
    logout,
    initAppFetchUser,
    loadUserState
  };
};