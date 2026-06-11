import { api } from "@/shared/api/api";
import { useMutation } from "@tanstack/react-query";

export const useSignup = () => {
    return useMutation({
        mutationFn: async (credentials: {
            email: string;
            password: string;
        }) => {
            const { data }: { data: { message: string } } = await api.post(
                "/auth/register",
                credentials,
            );
            return data;
        },
    });
};
