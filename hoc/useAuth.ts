import { useRecoilState } from 'recoil';
import { loginUserState } from '@hongpung/recoil/authState';
import { User } from '@hongpung/UserType';
import { deleteToken, getToken, saveToken } from '@hongpung/utils/TokenHandler';

export const useAuth = () => {
  const [loginUser, setLoginUser] = useRecoilState(loginUserState);

  // AbortController는 여기서 생성하여 요청에 사용
  const controller = new AbortController();
  const signal = controller.signal;

  const checkValidToken = async (): Promise<boolean> => {
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

        const userStatus = await loadUser.json() as User;

        setLoginUser(userStatus);

        console.log(userStatus);
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

        const loadUser = await fetch(`${process.env.BASE_URL}/member/status`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
            }
          }
        )

        const userStatus = await loadUser.json() as User;

        await saveToken('token', token);

        setLoginUser(userStatus);

        console.log(userStatus);
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
    await deleteToken('token');
    setLoginUser(null);
  };

  return {
    loginUser,
    login,
    logout,
    checkValidToken
  };
};