'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DiaryEntryCard } from './diary-entry-card';
import { diaryApi } from '@/lib/api/diary';
import type { DiaryEntry } from '@/lib/types/diary';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export function DiaryFeed({ havenId }: { havenId: string }) {
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setLoading(true);
        diaryApi
            .list(havenId, page)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setEntries((prev) => (page === 1 ? res.data!.items : [...prev, ...res.data!.items]));
                    setHasMore(res.data.hasNextPage);
                }
            })
            .finally(() => setLoading(false));
    }, [havenId, page]);

    if (loading && entries.length === 0) {
        return (
            <div className="space-y-5">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-28 rounded-lg" />
                ))}
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">No journal entries yet.</p>
                <Button asChild>
                    <Link href={`/havens/${havenId}/journals/new`}>Write your first entry</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {entries.map((entry) => (
                <DiaryEntryCard key={entry.id} entry={entry} havenId={havenId} />
            ))}
            {hasMore && (
                <div className="text-center pt-2">
                    <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={loading}>
                        {loading ? 'Loading...' : 'Load more'}
                    </Button>
                </div>
            )}
        </div>
    );
}
