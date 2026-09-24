import { create } from 'zustand';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const TOKEN_KEY = 'megamart_jwt_token';
const USER_KEY = 'megamart_user_data';

const getInitialToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const getInitialUser = (): User | null => {
  const saved = localStorage.getItem(USER_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => {
  const initialToken = getInitialToken();
  const initialUser = getInitialUser();

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken && !!initialUser,

    setAuth: (user: User, token: string) => {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({
        user,
        token,
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },
  };
});
