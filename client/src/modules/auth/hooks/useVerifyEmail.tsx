import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api";

export function useVerifyEmail(token: string | null) {
    return useQuery({
        queryKey: ["verify-email", token],
        queryFn: async () => {
            if (!token) throw new Error("Token is required");
            const { data } = await api.get(`/auth/verify-email?token=${token}`);
            return data;
        },
        enabled: !!token, // Не запускаем запрос, если токена нет
        staleTime: 0, // Никогда не кэшируем результат
        gcTime: 0, // Сразу удаляем из кэша после размонтирования
        retry: false, // Не повторяем запрос при ошибке (токен одноразовый)
    });
}
