import api from './client';
import type { ApiResponse, PaginatedResult } from '@/lib/types/api';
import type { Capsule, CreateCapsuleRequest, UpdateCapsuleRequest } from '@/lib/types/capsule';

export const capsulesApi = {
    create: (havenId: string, data: CreateCapsuleRequest) =>
        api.post<ApiResponse<Capsule>>(`/havens/${havenId}/capsules`, data),

    list: (havenId: string, page = 1, pageSize = 20, status?: string) =>
        api.get<ApiResponse<PaginatedResult<Capsule>>>(`/havens/${havenId}/capsules`, {
            params: { page, pageSize, status },
        }),

    get: (havenId: string, capsuleId: string) =>
        api.get<ApiResponse<Capsule>>(`/havens/${havenId}/capsules/${capsuleId}`),

    update: (havenId: string, capsuleId: string, data: UpdateCapsuleRequest) =>
        api.put<ApiResponse<Capsule>>(`/havens/${havenId}/capsules/${capsuleId}`, data),

    unlock: (havenId: string, capsuleId: string) =>
        api.post<ApiResponse>(`/havens/${havenId}/capsules/${capsuleId}/unlock`),

    delete: (havenId: string, capsuleId: string) =>
        api.delete<ApiResponse>(`/havens/${havenId}/capsules/${capsuleId}`),
};
