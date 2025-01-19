import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser } from "../utils/auth";
import { setAuthToken, removeAuthToken, getAuthToken } from "../hooks/useLocalStorageAuth";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  error: string | null;
  register: (username: string, email: string, password: string) => Promise<any>;
  login: (identifier: string, password: string) => Promise<any>;
  logout: () => void;
  loadToken: () => void;
  setUser: (user: User) => void;
  getUserId: () => number | null; // Selector to get user ID from token
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!getAuthToken(),
  user: null,
  error: null,
  register: async (username, email, password) => {
    try {
      const data = await registerUser(username, email, password);
      //setAuthToken(data.jwt);
      //set({ isLoggedIn: true, user: data.user, error: null });
      console.log('authStore register data', data);
      return data;
    } catch (error) {
      // @ts-ignore
      set({ error: error.message });
    }
  },
  login: async (identifier, password) => {
    try {
      const data = await loginUser(identifier, password);
      setAuthToken(data.jwt);
      set({ isLoggedIn: true, user: data.user, error: null });
      return data;
    } catch (error) {
      // @ts-ignore
      set({ error: error.message });
    }
  },
  logout: () => {
    removeAuthToken();
    set({ isLoggedIn: false, user: null, error: null });
  },
  loadToken: () => {
    const token = getAuthToken();
    if (token) {
      // Optionally validate token and set user info
      // set({ isLoggedIn: true });
    }
  },
  setUser: (user) => set({ user }),
  getUserId: () => {
    const token = getAuthToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // @ts-ignore
        return decoded.id || null;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  },
}));
