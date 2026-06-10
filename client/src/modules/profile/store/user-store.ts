import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    id: string;
    name: string;
    email: string;
    isTwoFactorEnabled: boolean;
}

export interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    updateUser: (user: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user: User) => set({ user: user }),
            updateUser: (data: Partial<User>) =>
                set((state: UserState) => ({
                    user: state.user ? { ...state.user, ...data } : null,
                })),
        }),
        { name: "user-me" },
    ),
);
