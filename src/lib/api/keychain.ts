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

function sessionHeaders(sessionToken: string) {
    return { headers: { 'X-Vault-Session': sessionToken } };
}

export const keychainApi = {
    unlock: (havenId: string, password: string) =>
        api.post<ApiResponse<UnlockResult>>(`/havens/${havenId}/keychain/unlock`, { password }),

    getCategories: (havenId: string, sessionToken: string) =>
        api.get<ApiResponse<KeychainCategory[]>>(`/havens/${havenId}/keychain/categories`, sessionHeaders(sessionToken)),
    createCategory: (havenId: string, data: CreateCategoryRequest, sessionToken: string) =>
        api.post<ApiResponse<KeychainCategory>>(`/havens/${havenId}/keychain/categories`, data, sessionHeaders(sessionToken)),

    createEntry: (havenId: string, data: CreateEntryRequest, sessionToken: string) =>
        api.post<ApiResponse<KeychainEntryList>>(`/havens/${havenId}/keychain`, data, sessionHeaders(sessionToken)),
    getEntries: (havenId: string, sessionToken: string, categoryId?: string) =>
        api.get<ApiResponse<KeychainEntryList[]>>(`/havens/${havenId}/keychain`, {
            params: { categoryId },
            ...sessionHeaders(sessionToken),
        }),
    getEntry: (havenId: string, entryId: string, sessionToken: string) =>
        api.get<ApiResponse<KeychainEntry>>(`/havens/${havenId}/keychain/${entryId}`, sessionHeaders(sessionToken)),
    updateEntry: (havenId: string, entryId: string, data: UpdateEntryRequest, sessionToken: string) =>
        api.put<ApiResponse<KeychainEntryList>>(`/havens/${havenId}/keychain/${entryId}`, data, sessionHeaders(sessionToken)),
    deleteEntry: (havenId: string, entryId: string, sessionToken: string) =>
        api.delete<ApiResponse>(`/havens/${havenId}/keychain/${entryId}`, sessionHeaders(sessionToken)),
};
