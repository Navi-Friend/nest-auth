import { useAuthStore } from "@/modules/auth/store/auth-store";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await api.post<{ accessToken: string }>(
                    "/auth/refresh",
                );

                if (!data || !data.accessToken) {
                    throw new Error("No access token in refresh response");
                }

                useAuthStore.getState().setAccessToken(data.accessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                }

                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().clearAccessToken();

                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);
