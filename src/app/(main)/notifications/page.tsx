'use client';

import { NotificationFeed } from '@/components/notifications/notification-feed';

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className="text-muted-foreground">Stay up to date with your havens.</p>
            </div>
            <NotificationFeed />
        </div>
    );
}
