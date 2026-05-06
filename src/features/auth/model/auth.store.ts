import { create } from "zustand";
import { User } from "../types/auth.type";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isLoading: false,
  setAccessToken: (token) => {
    console.log(`[AuthStore] Setting accessToken: ${token ? "EXISTS" : "NULL"}`);
    set({ accessToken: token });
  },
  setUser: (user) => {
    console.log(`[AuthStore] Setting user: ${user?.email || "NULL"}`);
    set({ user });
  },
  setLoading: (isLoading) => set({ isLoading }),
  clearAuth: () => {
    console.log("[AuthStore] Clearing Auth State");
    set({ accessToken: null, user: null, isLoading: false });
  },
}));
