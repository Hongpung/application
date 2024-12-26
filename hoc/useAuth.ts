import { useRecoilState, useSetRecoilState } from 'recoil';
import { loginUserState, useOnReserve } from '@hongpung/recoil/authState';
import { User } from '@hongpung/UserType';
import { deleteToken, getToken, saveToken } from '@hongpung/utils/TokenHandler';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@hongpung/utils/NotificationToken';
import { StackActions, useNavigation } from '@react-navigation/native';

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
        const loadUser = await fetch(`${process.env.SUB_API}/member/status`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
            }
          }
        )

        if (!loadUser.ok) throw Error('유저 정보 로드 실패')
        const userStatus = await loadUser.json() as User;

        console.log(userStatus)//
        if (!userStatus) throw Error('유저 정보가 비어 있음')

        const { status } = await Notifications.requestPermissionsAsync();

        const sendFormat: { pushEnable: boolean, notificationToken: null | string } = { pushEnable: (status === 'granted'), notificationToken: null }

        if (status === 'granted') {
          const token = await registerForPushNotificationsAsync()
          sendFormat.notificationToken = token//
        }

        setLoginUser(userStatus);

        const fetchFCM = await fetch(`${process.env.SUB_API}/member/token`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': `application/json`,
            },
            body: JSON.stringify(sendFormat)
          }
        )

        if (!fetchFCM.ok) throw Error('토큰 생성 실패')

        const useSession = await fetch(`${process.env.SUB_API}/room-session/isCheckin`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        })

        if (!useSession.ok) throw Error('세션 불러오기 실패')

        const { isCheckin } = await useSession.json()
        console.log('isCheckin:', isCheckin)

        if (isCheckin == true) {
          console.log('세션 연겨룀')
          setOnSession(true)
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

      console.log(JSON.stringify(loginData))
      const response = await fetch(`${process.env.SUB_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
        signal,
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error('Network response was not ok: ' + message);
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
      if (!loginUser) console.log('유저 정보가 없음')
      const token = await getToken('token');

      const fetchFCM = await fetch(`${process.env.SUB_API}/member/token/${loginUser?.memberId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
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