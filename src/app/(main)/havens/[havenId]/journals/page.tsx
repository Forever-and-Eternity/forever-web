'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StreakBanner } from '@/components/diary/streak-banner';
import { DiaryFeed } from '@/components/diary/diary-feed';
import { OnThisDayCard } from '@/components/diary/on-this-day-card';
import { Plus } from 'lucide-react';

export default function JournalsPage() {
    const params = useParams();
    const havenId = params.havenId as string;

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">Journals</h1>
                    <p className="text-sm text-muted-foreground">Your daily reflections and memories.</p>
                </div>
                <Button size="sm" asChild>
                    <Link href={`/havens/${havenId}/journals/new`}>
                        <Plus className="h-4 w-4 mr-1" />
                        New Entry
                    </Link>
                </Button>
            </div>

            <StreakBanner havenId={havenId} />
            <OnThisDayCard havenId={havenId} />
            <DiaryFeed havenId={havenId} />
        </div>
    );
}
