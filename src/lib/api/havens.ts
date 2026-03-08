import axios from 'axios';
import api from './client';
import type { ApiResponse, PaginatedResult } from '@/lib/types/api';
import type { CreateHavenRequest, Haven, HavenMember, InviteMemberRequest, UpdateHavenRequest } from '@/lib/types/haven';

export const havensApi = {
    create: (data: CreateHavenRequest) => api.post<ApiResponse<Haven>>('/havens', data),

    list: (page = 1, pageSize = 20) =>
        api.get<ApiResponse<PaginatedResult<Haven>>>('/havens', {
            params: { page, pageSize },
        }),

    get: (id: string) => api.get<ApiResponse<Haven>>(`/havens/${id}`),

    update: (id: string, data: UpdateHavenRequest) => api.put<ApiResponse<Haven>>(`/havens/${id}`, data),

    delete: (id: string) => api.delete<ApiResponse>(`/havens/${id}`),

    inviteMember: (havenId: string, data: InviteMemberRequest) => api.post<ApiResponse>(`/havens/${havenId}/members`, data),

    getMembers: (havenId: string) => api.get<ApiResponse<HavenMember[]>>(`/havens/${havenId}/members`),

    removeMember: (havenId: string, memberId: string) => api.delete<ApiResponse>(`/havens/${havenId}/members/${memberId}`),

    getCoverUploadUrl: (havenId: string, fileName: string, fileSize: number, contentType: string) =>
        api.post<ApiResponse<{ presignedUrl: string; coverKey: string }>>(`/havens/${havenId}/cover-upload-url`, { fileName, fileSize, contentType }),

    confirmCover: (havenId: string, coverKey: string) =>
        api.put<ApiResponse<Haven>>(`/havens/${havenId}/cover-confirm`, { coverKey }),

    async uploadCover(havenId: string, file: File): Promise<Haven | null> {
        const { data: urlRes } = await this.getCoverUploadUrl(havenId, file.name, file.size, file.type || 'image/jpeg');
        if (!urlRes.success || !urlRes.data) return null;

        await axios.put(urlRes.data.presignedUrl, file, {
            headers: { 'Content-Type': file.type },
        });

        const { data: confirmRes } = await this.confirmCover(havenId, urlRes.data.coverKey);
        return confirmRes.success ? confirmRes.data ?? null : null;
    },
};
