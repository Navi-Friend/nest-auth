import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export interface AuthState {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    clearAccessToken: () => void;

    tempToken: string | null;
    setTempToken: (token: string) => void;
    clearTempToken: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                accessToken: null,
                tempToken: null,
                setAccessToken: (token: string) => set({ accessToken: token }),
                setTempToken: (token: string) => set({ tempToken: token }),
                clearAccessToken: () => set({ accessToken: null }),
                clearTempToken: () => set({ tempToken: null }),
            }),
            { name: "auth-storage" },
        ),
    ),
);
