import api from './client';
import type { ApiResponse, PaginatedResult } from '@/lib/types/api';
import type { Lesson, CreateLessonRequest, UpdateLessonRequest, LessonCategory } from '@/lib/types/lesson';

export const lessonsApi = {
    create: (havenId: string, data: CreateLessonRequest) =>
        api.post<ApiResponse<Lesson>>(`/havens/${havenId}/lessons`, data),

    list: (havenId: string, page = 1, pageSize = 20, category?: string, ageRelevant?: string) =>
        api.get<ApiResponse<PaginatedResult<Lesson>>>(`/havens/${havenId}/lessons`, {
            params: { page, pageSize, category, ageRelevant },
        }),

    get: (havenId: string, lessonId: string) =>
        api.get<ApiResponse<Lesson>>(`/havens/${havenId}/lessons/${lessonId}`),

    update: (havenId: string, lessonId: string, data: UpdateLessonRequest) =>
        api.put<ApiResponse<Lesson>>(`/havens/${havenId}/lessons/${lessonId}`, data),

    delete: (havenId: string, lessonId: string) =>
        api.delete<ApiResponse>(`/havens/${havenId}/lessons/${lessonId}`),

    getCategories: (havenId: string) =>
        api.get<ApiResponse<LessonCategory[]>>(`/havens/${havenId}/lessons/categories`),
};
