'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CapsuleCard } from './capsule-card';
import { capsulesApi } from '@/lib/api/capsules';
import type { Capsule } from '@/lib/types/capsule';
import { Package } from 'lucide-react';
import Link from 'next/link';

export function CapsuleList({ havenId }: { havenId: string }) {
    const [capsules, setCapsules] = useState<Capsule[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setLoading(true);
        setPage(1);
        const status = filter === 'all' ? undefined : filter;
        capsulesApi
            .list(havenId, 1, 20, status)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setCapsules(res.data.items);
                    setHasMore(res.data.hasNextPage);
                }
            })
            .finally(() => setLoading(false));
    }, [havenId, filter]);

    const loadMore = () => {
        const nextPage = page + 1;
        const status = filter === 'all' ? undefined : filter;
        capsulesApi.list(havenId, nextPage, 20, status).then(({ data: res }) => {
            if (res.success && res.data) {
                setCapsules((prev) => [...prev, ...res.data!.items]);
                setHasMore(res.data.hasNextPage);
                setPage(nextPage);
            }
        });
    };

    return (
        <div className="space-y-4">
            <Tabs value={filter} onValueChange={setFilter}>
                <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="all" className="flex-1 sm:flex-initial">All</TabsTrigger>
                    <TabsTrigger value="locked" className="flex-1 sm:flex-initial">Locked</TabsTrigger>
                    <TabsTrigger value="unlocked" className="flex-1 sm:flex-initial">Unlocked</TabsTrigger>
                    <TabsTrigger value="draft" className="flex-1 sm:flex-initial">Drafts</TabsTrigger>
                </TabsList>
            </Tabs>

            {loading ? (
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-36 rounded-lg" />
                    ))}
                </div>
            ) : capsules.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground mb-4">
                        {filter === 'all' ? 'No capsules yet.' : `No ${filter} capsules.`}
                    </p>
                    {filter === 'all' && (
                        <Button asChild>
                            <Link href={`/havens/${havenId}/capsules/new`}>Create your first capsule</Link>
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                        {capsules.map((capsule) => (
                            <CapsuleCard key={capsule.id} capsule={capsule} havenId={havenId} />
                        ))}
                    </div>
                    {hasMore && (
                        <div className="text-center pt-2">
                            <Button variant="outline" onClick={loadMore}>Load more</Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
