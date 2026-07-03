import { httpClient } from '../../../shared/api/httpClient';

export function register(credentials) {
  return httpClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function login(credentials) {
  return httpClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

