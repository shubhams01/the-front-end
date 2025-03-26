// src/utils/auth.ts
interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export const registerUser = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  // console.log('register ', username, email, password)
  const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/local/register`, {
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

  // console.log("Raw response: ", response);

  if (!response.ok) {
    const data = await response.json();
    // console.log("auth register response", data);
    throw new Error(`${data.error.message}`);
  }

  const jsonResponse = await response.json();
  // console.log("Parsed response: ", jsonResponse);
  return jsonResponse;
};

export const loginUser = async (identifier: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/local`, {
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
    const data = await response.json();
    // console.log('auth login response', data);
    throw new Error(`${data.error.message}`);
  }

  return response.json();
};
