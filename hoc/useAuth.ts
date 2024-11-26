import { useRecoilState, useSetRecoilState } from 'recoil';
import { loginUserState, useOnReserve } from '@hongpung/recoil/authState';
import { User } from '@hongpung/UserType';
import { deleteToken, getToken, saveToken } from '@hongpung/utils/TokenHandler';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@hongpung/utils/NotificationToken';
import { StackActions, useNavigation } from '@react-navigation/native';
import { onUseSession } from '@hongpung/recoil/sessionState';

export const useAuth = () => {
  const [loginUser, setLoginUser] = useRecoilState(loginUserState);
  const setOnSession = useSetRecoilState(useOnReserve);
  const controller = new AbortController();
  const signal = controller.signal;

  const initAppFetchUser = async () => {
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const token = await getToken('token');

      if (token) {
        const loadUser = await fetch(`${process.env.BASE_URL}/member/status`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
            }
          }
        )

        if (!loadUser.ok) throw Error('유저 정보 로드 실패')
        const userStatus = await loadUser.json() as User;

        const { memberId } = userStatus;
        const { status } = await Notifications.requestPermissionsAsync();

        const sendFormat: { email: string, memberId: string, pushEnable: boolean, notificationToken: null | string } = { memberId, email: userStatus?.email, pushEnable: (status === 'granted'), notificationToken: null }
        if (status === 'granted') {
          const token = await registerForPushNotificationsAsync()
          sendFormat.notificationToken = token//
        }
        //token
        const fetchFCM = await fetch(`${process.env.SUB_API}/member/token`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': `application/json`,
            },
            body: JSON.stringify(sendFormat)
          }
        )

        if (!fetchFCM.ok) throw Error('토큰 생성 실패')

        setLoginUser(userStatus);

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
        const loadUser = await fetch(`${process.env.BASE_URL}/member/status`,
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

  const login = async (email: string, password: string): Promise<boolean> => {
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
      const loginData = { email, password };

      const response = await fetch(`${process.env.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
        signal,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.status);
      }

      const result = await response.json();

      if (result.token) {
        const { token } = result;

        await saveToken('token', token);
        await initAppFetchUser();
        // Recoil 상태 업데이트
        return true;
      }
    } catch (e) {
      console.error(e);
    } finally {
      clearTimeout(timeoutId);
    }
    return false;
  };

  const logout = async () => {
    try {
      const fetchFCM = await fetch(`${process.env.SUB_API}/member/token/${loginUser?.memberId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': `application/json`,
          }
        }
      )
      if (!fetchFCM.ok) throw Error('failed to delete Expo Token')

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