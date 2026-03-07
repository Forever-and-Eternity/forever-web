import api from './client';
import type { ApiResponse } from '@/lib/types/api';
import type {
    KeychainCategory,
    CreateCategoryRequest,
    KeychainEntryList,
    KeychainEntry,
    CreateEntryRequest,
    UpdateEntryRequest,
    UnlockResult,
} from '@/lib/types/keychain';

export const keychainApi = {
    unlock: (havenId: string, password: string) =>
        api.post<ApiResponse<UnlockResult>>(`/havens/${havenId}/keychain/unlock`, { password }),

    getCategories: (havenId: string) =>
        api.get<ApiResponse<KeychainCategory[]>>(`/havens/${havenId}/keychain/categories`),
    createCategory: (havenId: string, data: CreateCategoryRequest) =>
        api.post<ApiResponse<KeychainCategory>>(`/havens/${havenId}/keychain/categories`, data),

    createEntry: (havenId: string, data: CreateEntryRequest) =>
        api.post<ApiResponse<KeychainEntryList>>(`/havens/${havenId}/keychain`, data),
    getEntries: (havenId: string, categoryId?: string) =>
        api.get<ApiResponse<KeychainEntryList[]>>(`/havens/${havenId}/keychain`, {
            params: { categoryId },
        }),
    getEntry: (havenId: string, entryId: string) =>
        api.get<ApiResponse<KeychainEntry>>(`/havens/${havenId}/keychain/${entryId}`),
    updateEntry: (havenId: string, entryId: string, data: UpdateEntryRequest) =>
        api.put<ApiResponse<KeychainEntryList>>(`/havens/${havenId}/keychain/${entryId}`, data),
    deleteEntry: (havenId: string, entryId: string) =>
        api.delete<ApiResponse>(`/havens/${havenId}/keychain/${entryId}`),
};
