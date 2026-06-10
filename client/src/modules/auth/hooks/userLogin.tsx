import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { api } from "@/shared/api/api";
import { ApiError } from "@/shared/api/api-error";
import { useAuthStore } from "../state/auth-state";

export const useLogin = () => {
    const navigate = useNavigate();
    const authStore = useAuthStore((state) => state);

    return useMutation({
        mutationFn: async (credentials: {
            email: string;
            password: string;
        }) => {
            const { data }: { data: { accessToken: string } } = await api.post(
                "/auth/login",
                credentials,
            );
            return data;
        },
        onSuccess: (data) => {
            authStore.setAccessToken(data.accessToken);
            toast.success("Welcome!");
            navigate("/profile");
        },
        onError: (error: unknown) => {
            const apiError = new ApiError(error);

            toast.error(apiError.responseMessage);
        },
    });
};
