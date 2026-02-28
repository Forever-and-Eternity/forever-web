import api from './client';
import type { ApiResponse } from '@/lib/types/api';
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    UpdateProfileRequest,
    UserPreferences,
    UserProfile,
} from '@/lib/types/auth';

export const authApi = {
    register: (data: RegisterRequest) => api.post<ApiResponse<LoginResponse>>('/auth/register', data),

    login: (data: LoginRequest) => api.post<ApiResponse<LoginResponse>>('/auth/login', data),

    logout: (refreshToken: string) => api.post<ApiResponse>('/auth/logout', { refreshToken }),

    getProfile: () => api.get<ApiResponse<UserProfile>>('/auth/me'),

    updateProfile: (data: UpdateProfileRequest) => api.put<ApiResponse<UserProfile>>('/auth/me', data),

    getPreferences: () => api.get<ApiResponse<UserPreferences>>('/auth/preferences'),

    updatePreferences: (data: UserPreferences) => api.put<ApiResponse<UserPreferences>>('/auth/preferences', data),
};
