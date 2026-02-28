export interface ApiResponse<T = void> {
    data?: T;
    success: boolean;
    errors: string[];
}

export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
