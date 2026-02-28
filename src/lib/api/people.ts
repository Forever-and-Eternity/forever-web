import api from './client';
import type { ApiResponse } from '@/lib/types/api';
import type { CreatePersonRequest, Person, PersonTag, TagContentRequest, UpdatePersonRequest } from '@/lib/types/people';

export const peopleApi = {
    create: (havenId: string, data: CreatePersonRequest) => api.post<ApiResponse<Person>>(`/havens/${havenId}/people`, data),

    list: (havenId: string) => api.get<ApiResponse<Person[]>>(`/havens/${havenId}/people`),

    get: (havenId: string, personId: string) => api.get<ApiResponse<Person>>(`/havens/${havenId}/people/${personId}`),

    update: (havenId: string, personId: string, data: UpdatePersonRequest) =>
        api.put<ApiResponse<Person>>(`/havens/${havenId}/people/${personId}`, data),

    delete: (havenId: string, personId: string) => api.delete<ApiResponse>(`/havens/${havenId}/people/${personId}`),

    invite: (havenId: string, personId: string) => api.post<ApiResponse>(`/havens/${havenId}/people/${personId}/invite`),

    tagContent: (contentId: string, data: TagContentRequest) => api.post<ApiResponse>(`/content/${contentId}/tags`, data),

    getContentTags: (contentId: string) => api.get<ApiResponse<PersonTag[]>>(`/content/${contentId}/tags`),

    removeTag: (contentId: string, tagId: string) => api.delete<ApiResponse>(`/content/${contentId}/tags/${tagId}`),
};
