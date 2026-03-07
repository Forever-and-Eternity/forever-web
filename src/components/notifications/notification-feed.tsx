'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { notificationsApi } from '@/lib/api/notifications';
import type { Notification } from '@/lib/types/notification';
import { Bell, CheckCheck } from 'lucide-react';

export function NotificationFeed() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        notificationsApi
            .list(page)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setNotifications((prev) =>
                        page === 1 ? res.data!.items : [...prev, ...res.data!.items]
                    );
                    setHasMore(res.data.hasNextPage);
                }
            })
            .finally(() => setLoading(false));
    }, [page]);

    const handleMarkAllRead = async () => {
        await notificationsApi.markAllAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
    };

    const handleMarkRead = async (id: string) => {
        await notificationsApi.markAsRead(id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
        );
    };

    const unreadNotifications = notifications.filter((n) => !n.isRead);
    const readNotifications = notifications.filter((n) => n.isRead);

    if (loading && notifications.length === 0) {
        return (
            <div className="space-y-3 max-w-2xl mx-auto">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notifications yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {unreadNotifications.length > 0 && (
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        New ({unreadNotifications.length})
                    </h3>
                    <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                        <CheckCheck className="h-4 w-4 mr-1" />
                        Mark all read
                    </Button>
                </div>
            )}

            {unreadNotifications.map((n) => (
                <Card
                    key={n.id}
                    className="cursor-pointer border-l-4 border-l-primary hover:bg-accent/50 transition-colors"
                    onClick={() => handleMarkRead(n.id)}
                >
                    <CardContent className="py-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    {n.title && <p className="font-medium text-sm">{n.title}</p>}
                                    <Badge variant="secondary" className="text-xs">{n.type}</Badge>
                                </div>
                                {n.body && <p className="text-sm text-muted-foreground mt-1">{n.body}</p>}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {readNotifications.length > 0 && (
                <>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Earlier
                    </h3>
                    {readNotifications.map((n) => (
                        <Card key={n.id} className="opacity-75">
                            <CardContent className="py-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            {n.title && <p className="font-medium text-sm">{n.title}</p>}
                                            <Badge variant="outline" className="text-xs">{n.type}</Badge>
                                        </div>
                                        {n.body && <p className="text-sm text-muted-foreground mt-1">{n.body}</p>}
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {new Date(n.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </>
            )}

            {hasMore && (
                <div className="text-center">
                    <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={loading}>
                        {loading ? 'Loading...' : 'Load more'}
                    </Button>
                </div>
            )}
        </div>
    );
}
