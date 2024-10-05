import { getToken } from '@hongpung/utils/TokenHandler';
import { useEffect, useState } from 'react';

interface UseFetchOptions extends RequestInit {
  timeout?: number;
}

interface UseFetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

const useFetch = <T>(url: string | null, options: UseFetchOptions = {}, timeout: number = 5000, dependencies?: any[]): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true); // 요청 시작 시 loading을 true로 설정
      const timeoutId = setTimeout(() => controller.abort(), timeout);
     
      try {
        const token = await getToken('token');

        if(!token) throw Error('invalid Token');

        console.log('fetching...')
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
          },
          signal
        })
        if (!response.ok) {
          console.log(response.status+response.statusText)
          throw new Error('Network response was not ok');
        }
        const result: T = await response.json();
        setData(result);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          setError('Request was canceled'+err.status);
        } else {
          setError(err.message+' '+err.status);
        }
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
    
  }, dependencies);
  return { data, error, loading };
};

export default useFetch;