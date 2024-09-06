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

  console.log(loading)

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true); // 요청 시작 시 loading을 true로 설정
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        console.log('fetching...')
        const response = await fetch(url, { ...options, signal });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: T = await response.json();
        setData(result);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          setError('Request was canceled');
        } else {
          setError(err.message);
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