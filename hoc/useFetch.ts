import { useEffect, useState } from 'react';

interface UseFetchOptions extends RequestInit {
  timeout?: number;
}

interface UseFetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

const useFetch = <T>(url: string, options: UseFetchOptions = {}, timeout: number = 5000): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
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
  }, [url, options, timeout]);

  return { data, error, loading };
};

export default useFetch;