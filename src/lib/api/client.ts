import axios from 'axios';
import { useAuthStore } from '@/lib/stores/auth-store';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

api.interceptors.request.use((config) => {
    const isAuthPath = AUTH_PATHS.some((p) => config.url?.includes(p));
    if (!isAuthPath) {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthPath = AUTH_PATHS.some((p) => originalRequest.url?.includes(p));
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthPath) {
            originalRequest._retry = true;

            const refreshToken = useAuthStore.getState().refreshToken;
            if (!refreshToken) {
                useAuthStore.getState().logout();
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, { refreshToken });

                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                useAuthStore.getState().setTokens(accessToken, newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch {
                useAuthStore.getState().logout();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
