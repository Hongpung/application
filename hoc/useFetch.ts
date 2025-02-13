import { useEffect, useState } from 'react';
import { UseFetchOptions, UseFetchResult } from '@hongpung/hoc/types/FetchTypes';


const useFetch = <T>(url: string | null, options: UseFetchOptions = {}, timeout: number = 5000, dependencies: any[] = []): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetching = async () => {

      setLoading(true); // 요청 시작 시 loading을 true로 설정
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {

        if (!url) throw Error('invalid url');;

        console.log('fetching...')
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
          },
          signal
        })

        if (!response.ok) {
          console.log(response.status + response.statusText)
          throw new Error('Network response was not ok');
        }
        const result: T = await response.json();

        setData(result);

      } catch (err: unknown) {
        if (err instanceof Error) {
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
        clearTimeout(timeoutId);
        setLoading(false);
      }

    }
    fetching();

    return () => {
      controller.abort();
    };
  }, [...dependencies]);

  return { data, error, loading };
};

export default useFetch;