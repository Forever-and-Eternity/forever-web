import api from './client';
import type { ApiResponse, PaginatedResult } from '@/lib/types/api';
import type { ConfirmUploadRequest, ContentItem, UploadUrlRequest, UploadUrlResponse } from '@/lib/types/content';
import type { ContentType } from '@/lib/types/enums';

export const contentApi = {
    getUploadUrl: (havenId: string, data: UploadUrlRequest) =>
        api.post<ApiResponse<UploadUrlResponse>>(`/havens/${havenId}/content/upload-url`, data),

    confirmUpload: (havenId: string, contentId: string, data: ConfirmUploadRequest) =>
        api.post<ApiResponse<ContentItem>>(`/havens/${havenId}/content/${contentId}/confirm`, data),

    list: (havenId: string, page = 1, pageSize = 20, type?: ContentType) =>
        api.get<ApiResponse<PaginatedResult<ContentItem>>>(`/havens/${havenId}/content`, { params: { page, pageSize, type } }),

    get: (havenId: string, contentId: string) => api.get<ApiResponse<ContentItem>>(`/havens/${havenId}/content/${contentId}`),

    delete: (havenId: string, contentId: string) => api.delete<ApiResponse>(`/havens/${havenId}/content/${contentId}`),
};
