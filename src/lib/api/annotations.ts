import api from './client';
import type { ApiResponse } from '@/lib/types/api';
import type { Annotation, CreateAnnotationRequest } from '@/lib/types/annotation';

export const annotationsApi = {
    create: (contentId: string, data: CreateAnnotationRequest) => api.post<ApiResponse>(`/content/${contentId}/annotations`, data),

    list: (contentId: string) => api.get<ApiResponse<Annotation[]>>(`/content/${contentId}/annotations`),

    update: (contentId: string, annotationId: string, data: CreateAnnotationRequest) =>
        api.put<ApiResponse>(`/content/${contentId}/annotations/${annotationId}`, data),

    delete: (contentId: string, annotationId: string) => api.delete<ApiResponse>(`/content/${contentId}/annotations/${annotationId}`),
};
