import axios from 'axios';
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

    getAvatarUploadUrl: (fileName: string, fileSize: number, contentType: string) =>
        api.post<ApiResponse<{ presignedUrl: string; avatarKey: string }>>('/auth/avatar-upload-url', { fileName, fileSize, contentType }),

    confirmAvatar: (avatarKey: string) =>
        api.put<ApiResponse<UserProfile>>('/auth/avatar-confirm', { avatarKey }),

    async uploadAvatar(file: File): Promise<UserProfile | null> {
        const { data: urlRes } = await this.getAvatarUploadUrl(file.name, file.size, file.type || 'image/jpeg');
        if (!urlRes.success || !urlRes.data) return null;

        await axios.put(urlRes.data.presignedUrl, file, {
            headers: { 'Content-Type': file.type },
        });

        const { data: confirmRes } = await this.confirmAvatar(urlRes.data.avatarKey);
        return confirmRes.success ? confirmRes.data ?? null : null;
    },
};
