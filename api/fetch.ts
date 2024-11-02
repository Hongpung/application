import { getToken } from '@hongpung/utils/TokenHandler';

interface fetchOptions<T> {
    url: string,
    setLoading: (isLoadin: boolean) => void,
    setData: (data: T | null) => void,
    setError: (error: string | null) => void,
    controller: AbortController,
    options?: RequestInit
    timeout?: number
}


const fetchDataNotUseToken= async <T>({ url, setLoading, setData, setError, controller, options = {}, timeout = 5000 }: fetchOptions<T>) => {
    setLoading(true);
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {

        console.log('fetching...')
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
            }
        })
        if (!response.ok) {
            console.log(response.status + response.statusText)
            throw new Error('Network response was not ok');
        }
        const result: T = await response.json();
        setData(result);
    } catch (err: any) {
        if (err.name === 'AbortError') {
            setError('Request was canceled' + err.status);
        } else {
            setError(err.message + ' ' + err.status);
        }
    } finally {
        clearTimeout(timeoutId);
        setLoading(false);
    }
};

export default fetchDataNotUseToken;