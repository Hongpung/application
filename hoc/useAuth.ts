import { useRecoilState } from 'recoil';
import { tokenState, loginUserState } from '../recoil/authState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../UserType';

export const useAuth = () => {
  const [token, setToken] = useRecoilState(tokenState);
  const [loginUser, setLoginUser] = useRecoilState(loginUserState);

  // AbortController는 여기서 생성하여 요청에 사용
  const controller = new AbortController();
  const signal = controller.signal;

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

      console.log(result);

      if (result.token) {
        const { token } = result;
        setToken(token); // Recoil 상태 업데이트
        await AsyncStorage.setItem('token', token); // AsyncStorage에 저장
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
    await AsyncStorage.removeItem('token');
    setToken(null);
    setLoginUser(null);
  };

  return {
    token,
    loginUser,
    login,
    logout,
  };
};