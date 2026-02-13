import { API_URL } from '../config/env';

interface FetchOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
}

async function fetchJson<T>(endpoint: string, options: FetchOptions): Promise<T> {
  const { method, body } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const http = {
  get: <T>(endpoint: string) => fetchJson<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown) => fetchJson<T>(endpoint, { method: 'POST', body }),
  patch: <T>(endpoint: string, body?: unknown) => fetchJson<T>(endpoint, { method: 'PATCH', body }),
  delete: <T>(endpoint: string) => fetchJson<T>(endpoint, { method: 'DELETE' }),
};
