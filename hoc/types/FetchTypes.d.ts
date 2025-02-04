export interface UseFetchOptions extends RequestInit {
  timeout?: number;
}

export interface UseFetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}