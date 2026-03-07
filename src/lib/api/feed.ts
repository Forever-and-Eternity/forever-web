import api from './client';
import type { ApiResponse, PaginatedResult } from '@/lib/types/api';
import type { FeedActivity } from '@/lib/types/feed';

export const feedApi = {
    getActivities: (
        havenId: string,
        page = 1,
        pageSize = 20,
        from?: string,
        to?: string,
        includeDismissed = false,
    ) =>
        api.get<ApiResponse<PaginatedResult<FeedActivity>>>(
            `/havens/${havenId}/feed`,
            {
                params: { page, pageSize, from, to, includeDismissed },
            },
        ),

    dismiss: (havenId: string, activityId: string) =>
        api.put<ApiResponse>(`/havens/${havenId}/feed/${activityId}/dismiss`),

    dismissAll: (havenId: string) =>
        api.put<ApiResponse<{ dismissed: number }>>(
            `/havens/${havenId}/feed/dismiss-all`,
        ),
};
