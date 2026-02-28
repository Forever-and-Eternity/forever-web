import api from './client';
import type { ApiResponse } from '@/lib/types/api';
import type { LoginRequest, LoginResponse, RegisterRequest, UpdateProfileRequest, UserProfile } from '@/lib/types/auth';

export const authApi = {
    register: (data: RegisterRequest) => api.post<ApiResponse<LoginResponse>>('/auth/register', data),

    login: (data: LoginRequest) => api.post<ApiResponse<LoginResponse>>('/auth/login', data),

    logout: (refreshToken: string) => api.post<ApiResponse>('/auth/logout', { refreshToken }),

    getProfile: () => api.get<ApiResponse<UserProfile>>('/auth/me'),

    updateProfile: (data: UpdateProfileRequest) => api.put<ApiResponse<UserProfile>>('/auth/me', data),
};
