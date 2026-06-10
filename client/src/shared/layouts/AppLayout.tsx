import { useAuthStore } from "@/modules/auth/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { api } from "../api/api";
import { useUserStore, type User } from "@/modules/profile/store/user-store";

export function AppLayout() {
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);
    const accessToken = useAuthStore((state) => state.accessToken);
    const { data: userData } = useQuery<User>({
        queryKey: ["user-me"],
        queryFn: async () => {
            const { data } = await api.get("/auth/me");
            return data;
        },
        enabled: !!accessToken,
        retry: 3,
    });

    useEffect(() => {
        if (!accessToken) {
            navigate("/login");
        } else if (userData) {
            setUser(userData);
        }
    }, [accessToken, navigate, setUser, userData]);

    return (
        <>
            <div className="w-screen h-screen relative flex justify-center items-center">
                <div className="flex items-center justify-center absolute min-h-screen min-w-screen bg-linear-to-br from-green-600 via-emerald-600 to-teal-700 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="absolute max-w-full z-10">
                    <Outlet />
                </div>
            </div>
        </>
    );
}
