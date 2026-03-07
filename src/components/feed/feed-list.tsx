'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FeedItemCard } from './feed-item';
import { feedApi } from '@/lib/api/feed';
import type { FeedActivity } from '@/lib/types/feed';
import { Eraser, Loader2 } from 'lucide-react';

type RangePreset = '7d' | '30d' | 'all';

function daysAgoISO(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
}

function todayISO(): string {
    return new Date().toISOString().slice(0, 10);
}

function formatDayLabel(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === yesterday.getTime()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function DailySummary({ items }: { items: FeedActivity[] }) {
    const dailyCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const item of items) {
            const day = item.createdAt.slice(0, 10);
            counts[day] = (counts[day] || 0) + 1;
        }
        return Object.entries(counts)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, count]) => ({ date, count }));
    }, [items]);

    if (dailyCounts.length === 0) return null;

    const maxCount = Math.max(...dailyCounts.map((d) => d.count));

    return (
        <div className="hidden md:block rounded-lg border bg-card p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Daily Summary</p>
            <div className="space-y-2">
                {dailyCounts.map(({ date, count }) => (
                    <div key={date} className="flex items-center gap-3">
                        <div className="flex items-center gap-2 w-24 shrink-0">
                            <span className="size-2 rounded-full bg-primary shrink-0" />
                            <span className="text-xs text-muted-foreground truncate">{formatDayLabel(date)}</span>
                        </div>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full rounded-full bg-primary/60 transition-all"
                                style={{ width: `${(count / maxCount) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                            {count} {count === 1 ? 'update' : 'updates'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function FeedList({ havenId }: { havenId: string }) {
    const [items, setItems] = useState<FeedActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [dismissingAll, setDismissingAll] = useState(false);

    // Date filter state
    const [preset, setPreset] = useState<RangePreset>('7d');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');

    // Derive the actual from/to values for the API call
    const getDateRange = useCallback((): {
        from?: string;
        to?: string;
    } => {
        if (preset === '7d') return { from: daysAgoISO(7), to: todayISO() };
        if (preset === '30d') return { from: daysAgoISO(30), to: todayISO() };
        if (preset === 'all') return {};
        return {};
    }, [preset]);

    const getCustomDateRange = useCallback((): {
        from?: string;
        to?: string;
    } => {
        if (customFrom || customTo) {
            return {
                from: customFrom || undefined,
                to: customTo || undefined,
            };
        }
        return getDateRange();
    }, [customFrom, customTo, getDateRange]);

    // Determine the effective date range: custom overrides preset
    const isCustom = customFrom !== '' || customTo !== '';

    const fetchActivities = useCallback(
        (pageNum: number, append: boolean) => {
            const range = isCustom ? getCustomDateRange() : getDateRange();
            const setLoadingFn = append ? setLoadingMore : setLoading;
            setLoadingFn(true);

            feedApi
                .getActivities(havenId, pageNum, 20, range.from, range.to)
                .then(({ data: res }) => {
                    if (res.success && res.data) {
                        setItems((prev) =>
                            append
                                ? [...prev, ...res.data!.items]
                                : res.data!.items,
                        );
                        setHasMore(res.data.hasNextPage);
                    }
                })
                .finally(() => setLoadingFn(false));
        },
        [havenId, isCustom, getCustomDateRange, getDateRange],
    );

    // Initial load and re-fetch when filters change
    useEffect(() => {
        setPage(1);
        fetchActivities(1, false);
    }, [fetchActivities]);

    // Load more
    function handleLoadMore() {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchActivities(nextPage, true);
    }

    // Preset change
    function selectPreset(p: RangePreset) {
        setPreset(p);
        setCustomFrom('');
        setCustomTo('');
    }

    // Custom date handlers
    function handleCustomFromChange(value: string) {
        setCustomFrom(value);
        setPreset('all'); // deselect presets visually
    }

    function handleCustomToChange(value: string) {
        setCustomTo(value);
        setPreset('all');
    }

    // Dismiss a single activity
    function handleDismiss(activityId: string) {
        // Optimistic removal
        setItems((prev) => prev.filter((item) => item.id !== activityId));
        feedApi.dismiss(havenId, activityId).catch(() => {
            // Re-fetch on error to restore state
            fetchActivities(1, false);
        });
    }

    // Dismiss all
    async function handleDismissAll() {
        setDismissingAll(true);
        try {
            await feedApi.dismissAll(havenId);
            setItems([]);
            setHasMore(false);
        } catch {
            // Re-fetch on error
            fetchActivities(1, false);
        } finally {
            setDismissingAll(false);
        }
    }

    const presets: { key: RangePreset; label: string }[] = [
        { key: '7d', label: '7 days' },
        { key: '30d', label: '30 days' },
        { key: 'all', label: 'All time' },
    ];

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2
                    className="text-2xl font-bold"
                    style={{
                        fontFamily: 'var(--font-display-var), sans-serif',
                    }}
                >
                    Activity Feed
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismissAll}
                    disabled={dismissingAll || items.length === 0}
                    className="text-muted-foreground"
                >
                    {dismissingAll ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Eraser className="size-4" />
                    )}
                    Clear all
                </Button>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-2">
                {presets.map(({ key, label }) => (
                    <Button
                        key={key}
                        variant={preset === key && !isCustom ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => selectPreset(key)}
                    >
                        {label}
                    </Button>
                ))}

                <div className="flex items-center gap-1.5 ml-auto">
                    <label className="text-xs text-muted-foreground">From</label>
                    <input
                        type="date"
                        value={customFrom}
                        onChange={(e) => handleCustomFromChange(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <label className="text-xs text-muted-foreground">To</label>
                    <input
                        type="date"
                        value={customTo}
                        onChange={(e) => handleCustomToChange(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
            </div>

            {/* Daily summary — desktop only */}
            {!loading && items.length > 0 && <DailySummary items={items} />}

            {/* Feed items */}
            {loading && items.length === 0 ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                    No activity in this time range.
                </p>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <FeedItemCard
                            key={item.id}
                            item={item}
                            onDismiss={handleDismiss}
                        />
                    ))}
                </div>
            )}

            {/* Load more */}
            {hasMore && (
                <div className="text-center pb-4">
                    <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                    >
                        {loadingMore ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Load more'
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
