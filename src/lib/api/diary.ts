import api from './client';
import type { ApiResponse, PaginatedResult } from '@/lib/types/api';
import type { DiaryEntry, CreateDiaryEntryRequest, UpdateDiaryEntryRequest, DiaryStreak } from '@/lib/types/diary';

export const diaryApi = {
    create: (havenId: string, data: CreateDiaryEntryRequest) =>
        api.post<ApiResponse<DiaryEntry>>(`/havens/${havenId}/diary`, data),

    list: (havenId: string, page = 1, pageSize = 20, tag?: string, from?: string, to?: string) =>
        api.get<ApiResponse<PaginatedResult<DiaryEntry>>>(`/havens/${havenId}/diary`, {
            params: { page, pageSize, tag, from, to },
        }),

    get: (havenId: string, entryId: string) =>
        api.get<ApiResponse<DiaryEntry>>(`/havens/${havenId}/diary/${entryId}`),

    update: (havenId: string, entryId: string, data: UpdateDiaryEntryRequest) =>
        api.put<ApiResponse<DiaryEntry>>(`/havens/${havenId}/diary/${entryId}`, data),

    delete: (havenId: string, entryId: string) =>
        api.delete<ApiResponse>(`/havens/${havenId}/diary/${entryId}`),

    getStreak: (havenId: string) =>
        api.get<ApiResponse<DiaryStreak>>(`/havens/${havenId}/diary/streak`),

    getOnThisDay: (havenId: string) =>
        api.get<ApiResponse<DiaryEntry[]>>(`/havens/${havenId}/diary/on-this-day`),
};
