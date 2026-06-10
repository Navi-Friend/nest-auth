import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { api } from "@/shared/api/api";
import { ApiError } from "@/shared/api/api-error";
import { useAuthStore } from "../store/auth-store";
import { AxiosError } from "axios";

export const useLogin = () => {
    const navigate = useNavigate();
    const authStore = useAuthStore((state) => state);

    return useMutation({
        mutationFn: async (credentials: {
            email: string;
            password: string;
        }) => {
            const {
                data,
            }: { data: { accessToken: string; tempToken?: string } } =
                await api.post("/auth/login", credentials);
            return data;
        },
        onSuccess: (data) => {
            if (data.tempToken) {
                authStore.setTempToken(data.tempToken);
                toast.success("Please enter code from authentication app!");
                navigate("/2fa-verify");
            } else {
                authStore.setAccessToken(data.accessToken);
                toast.success("Welcome!");
                navigate("/profile");
            }
        },
        onError: (error: unknown) => {
            if (error instanceof AxiosError) {
                const apiError = new ApiError(error);

                toast.error(apiError.responseMessage);
            }
        },
    });
};
