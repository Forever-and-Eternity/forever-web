'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FeedItem } from './feed-item';
import { feedApi } from '@/lib/api/feed';
import type { FeedItem as FeedItemType } from '@/lib/types/feed';

export function FeedList({ havenId }: { havenId: string }) {
    const [items, setItems] = useState<FeedItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        feedApi
            .get(havenId, page)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setItems((prev) => (page === 1 ? res.data!.items : [...prev, ...res.data!.items]));
                    setHasMore(res.data.hasNextPage);
                }
            })
            .finally(() => setLoading(false));
    }, [havenId, page]);

    if (loading && items.length === 0) {
        return (
            <div className="space-y-4 max-w-2xl mx-auto">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return <p className="text-center text-muted-foreground py-12">No content in the feed yet.</p>;
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {items.map((item) => (
                <FeedItem key={item.id} item={item} />
            ))}
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
