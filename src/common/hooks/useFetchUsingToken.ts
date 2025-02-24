import { getToken } from '@hongpung/src/common/lib/TokenHandler';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { UseFetchOptions, UseFetchResult } from '@hongpung/src/common/hooks/types/FetchTypes';


const useFetchUsingToken = <T>(url: string | null, options: UseFetchOptions = {}, timeout: number = 5000, dependencies: any[] = []): UseFetchResult<T> => {

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetching = async () => {
      setLoading(true); // 요청 시작 시 loading을 true로 설정
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      try {

        if (!url) throw Error('invalid url');;

        const token = await getToken('token');

        if (!token) { throw Error('invalid Token'); }

        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
          },
          signal
        })

        if (!response.ok) {
          // console.log(response.status + response.statusText)
          throw new Error('Network response was not ok');
        }
        const result: T = await response.json() as T;

        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          // `invalid Token` 메시지일 경우 처리
          if (err.message === 'invalid Token') {
            setError('Invalid Token - Please login again.');
            navigation.dispatch(StackActions.replace('Login'))
            return;
          }
          // `AbortError`일 경우 처리
          if (err.name === 'AbortError') {
            const status = (err as any).status ?? ''; // status가 있으면 사용, 없으면 빈 문자열
            setError('Request was canceled ' + status);
          } else {
            // `status` 속성이 있는지 검사 후 처리
            const status = (err as any).status ?? ''; // status가 있으면 사용, 없으면 빈 문자열
            setError(err.message + ' ' + status);
          }
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
        clearTimeout(timeoutId);
      }
    }

    fetching();

    return () => {
      controller.abort();
    };
  }, [url, ...dependencies]);

  return { data, error, loading };
};

export default useFetchUsingToken;