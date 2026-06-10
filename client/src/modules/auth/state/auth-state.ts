import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export interface AuthState {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                accessToken: null,
                setAccessToken: (token: string) => set({ accessToken: token }),
                clearAuth: () => set({ accessToken: null }),
            }),
            { name: "auth-storage" },
        ),
    ),
);
