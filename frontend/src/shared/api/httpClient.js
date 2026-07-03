const configuredURL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const API_URL = configuredURL || '/api';

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export async function httpClient(path, { token, headers, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      payload?.error || 'Something went wrong. Please try again.',
      response.status,
      payload?.code,
    );
  }
  return payload;
}

