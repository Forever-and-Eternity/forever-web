import api from './client';
import type { ApiResponse, PaginatedResult } from '@/lib/types/api';
import type { Notification } from '@/lib/types/notification';

export const notificationsApi = {
    list: (page = 1, pageSize = 20) =>
        api.get<ApiResponse<PaginatedResult<Notification>>>('/notifications', {
            params: { page, pageSize },
        }),

    getUnreadCount: () =>
        api.get<ApiResponse<number>>('/notifications/unread-count'),

    markAsRead: (id: string) =>
        api.put<ApiResponse>(`/notifications/${id}/read`),

    markAllAsRead: () =>
        api.put<ApiResponse<number>>('/notifications/read-all'),
};
