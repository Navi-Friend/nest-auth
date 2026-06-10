import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "../store/auth-store";

export function AuthCallbackPage() {
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("accessToken");
        if (token) {
            setAccessToken(token);
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname,
            );
            navigate("/profile", { replace: true });
        } else {
            navigate("/login", { replace: true });
        }
    }, [searchParams, navigate, setAccessToken]);

    return <div>Dashboard content...</div>;
}
