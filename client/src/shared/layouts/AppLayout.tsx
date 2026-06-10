import { useAuthStore } from "@/modules/auth/state/auth-state";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export function AppLayout() {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        console.log("layout", accessToken);
        if (!accessToken) {
            navigate("/login");
        }
    }, [accessToken, navigate]);

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
