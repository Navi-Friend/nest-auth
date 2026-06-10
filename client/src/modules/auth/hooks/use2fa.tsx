import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api/api";

export const useGenerate2FA = () => {
    return useMutation({
        mutationFn: async () => {
            const { data } = await api.post("/auth/2fa/generate");
            return data as { secret: string; otpAuthUrl: string };
        },
    });
};

export const useEnable2FA = () => {
    return useMutation({
        mutationFn: async (code: string) => {
            const { data } = await api.post("/auth/2fa/enable", { code });
            return data;
        },
    });
};

export const useVerify2FALogin = () => {
    return useMutation({
        mutationFn: async ({
            tempToken,
            code,
        }: {
            tempToken: string;
            code: string;
        }) => {
            const { data } = await api.post("/auth/2fa/verify", {
                tempToken,
                code,
            });
            return data as { accessToken: string };
        },
    });
};
