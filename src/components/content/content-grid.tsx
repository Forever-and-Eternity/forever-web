'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentCard } from './content-card';
import { contentApi } from '@/lib/api/content';
import { ContentType, ContentTypeLabels } from '@/lib/types/enums';
import type { ContentItem } from '@/lib/types/content';

export function ContentGrid({ havenId }: { havenId: string }) {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setLoading(true);
        const type = typeFilter === 'all' ? undefined : (Number(typeFilter) as ContentType);
        contentApi
            .list(havenId, page, 20, type)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setItems(page === 1 ? res.data.items : (prev) => [...prev, ...res.data!.items]);
                    setHasMore(res.data.hasNextPage);
                }
            })
            .finally(() => setLoading(false));
    }, [havenId, page, typeFilter]);

    function handleFilterChange(value: string) {
        setTypeFilter(value);
        setPage(1);
        setItems([]);
    }

    return (
        <div>
            <div className="mb-4">
                <Select value={typeFilter} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {Object.entries(ContentTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {loading && items.length === 0 ? (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No content yet. Upload something!</p>
            ) : (
                <>
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                        {items.map((item) => (
                            <ContentCard key={item.id} item={item} havenId={havenId} />
                        ))}
                    </div>
                    {hasMore && (
                        <div className="mt-6 text-center">
                            <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={loading}>
                                {loading ? 'Loading...' : 'Load more'}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
