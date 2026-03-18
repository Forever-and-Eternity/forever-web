'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentCard } from './content-card';
import { ContentListItem } from './content-list-item';
import { contentApi } from '@/lib/api/content';
import { ContentType, ContentTypeLabels } from '@/lib/types/enums';
import type { ContentItem } from '@/lib/types/content';
import { useAuthStore } from '@/lib/stores/auth-store';

export function ContentGrid({ havenId }: { havenId: string }) {
    const prefs = useAuthStore((s) => s.user?.preferences);
    const [layout, setLayout] = useState<'grid' | 'list'>((prefs?.contentLayout as 'grid' | 'list') || 'grid');
    const compact = prefs?.compactMode ?? false;
    const [items, setItems] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setLoading(true);
        const type = typeFilter === 'all' ? undefined : (typeFilter as ContentType);
        contentApi
            .list(havenId, page, 20, type, debouncedSearch)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setItems(page === 1 ? res.data.items : (prev) => [...prev, ...res.data!.items]);
                    setHasMore(res.data.hasNextPage);
                }
            })
            .finally(() => setLoading(false));
    }, [havenId, page, typeFilter, debouncedSearch]);

    function handleFilterChange(value: string) {
        setTypeFilter(value);
        setPage(1);
        setItems([]);
    }

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        setPage(1);
        setItems([]);
    }

    return (
        <div>
            <div className="mb-4 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search content..."
                        value={search}
                        onChange={handleSearchChange}
                        className="pl-9"
                    />
                </div>
                <Select value={typeFilter} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-full sm:w-40">
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
                <div className="flex border rounded-md">
                    <Button
                        variant={layout === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        className="h-9 w-9 rounded-r-none"
                        onClick={() => setLayout('grid')}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={layout === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        className="h-9 w-9 rounded-l-none"
                        onClick={() => setLayout('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {loading && items.length === 0 ? (
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                    {debouncedSearch ? 'No content matches your search.' : 'No content yet. Upload something!'}
                </p>
            ) : (
                <>
                    {layout === 'grid' ? (
                    <div className={compact ? "grid gap-1.5 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5" : "grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}>
                        {items.map((item) => (
                            <ContentCard key={item.id} item={item} havenId={havenId} />
                        ))}
                    </div>
                    ) : (
                    <div className={compact ? "flex flex-col gap-1" : "flex flex-col gap-2"}>
                        {items.map((item) => (
                            <ContentListItem key={item.id} item={item} havenId={havenId} />
                        ))}
                    </div>
                    )}
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
