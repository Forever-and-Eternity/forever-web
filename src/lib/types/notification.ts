export interface Notification {
    id: string;
    type: string;
    title?: string;
    body?: string;
    data?: Record<string, unknown>;
    isRead: boolean;
    readAt?: string;
    createdAt: string;
}
