// src/utils/auth.ts
const API_URL = 'http://localhost:1337/api';

interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export const registerUser = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/local/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to register user');
  }

  return response.json();
};

export const loginUser = async (identifier: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/local`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to login user');
  }

  return response.json();
};
