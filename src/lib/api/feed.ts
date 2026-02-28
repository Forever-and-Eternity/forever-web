import api from './client';
import type { ApiResponse, PaginatedResult } from '@/lib/types/api';
import type { FeedItem } from '@/lib/types/feed';

export const feedApi = {
    get: (havenId: string, page = 1, pageSize = 20) =>
        api.get<ApiResponse<PaginatedResult<FeedItem>>>(`/havens/${havenId}/feed`, { params: { page, pageSize } }),
};
