'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HavenCard } from '@/components/havens/haven-card';
import { havensApi } from '@/lib/api/havens';
import { useHavenStore } from '@/lib/stores/haven-store';

export default function HavensPage() {
    const { havens, setHavens } = useHavenStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        havensApi
            .list(1, 100)
            .then(({ data: res }) => {
                if (res.success && res.data) setHavens(res.data.items);
            })
            .finally(() => setLoading(false));
    }, [setHavens]);

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Havens</h2>
                <Link href="/havens/new">
                    <Button>Create Haven</Button>
                </Link>
            </div>

            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-40 rounded-lg" />
                    ))}
                </div>
            ) : havens.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center">
                    <h3 className="text-lg font-medium">No havens yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Create your first haven to start preserving memories.</p>
                    <Link href="/havens/new">
                        <Button className="mt-4">Create Haven</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-stagger">
                    {havens.map((haven) => (
                        <HavenCard key={haven.id} haven={haven} />
                    ))}
                </div>
            )}
        </div>
    );
}
