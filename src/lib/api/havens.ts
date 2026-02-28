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
};
