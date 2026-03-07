'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { diaryApi } from '@/lib/api/diary';
import type { DiaryEntry } from '@/lib/types/diary';
import { CalendarDays } from 'lucide-react';

export function OnThisDayCard({ havenId }: { havenId: string }) {
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        diaryApi
            .getOnThisDay(havenId)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setEntries(res.data);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [havenId]);

    if (loading || entries.length === 0) return null;

    return (
        <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5" />
                On This Day
            </h2>
            {entries.map((entry) => {
                const yearsAgo = new Date().getFullYear() - new Date(entry.createdAt).getFullYear();
                return (
                    <Card key={entry.id} className="border-primary/20">
                        <CardContent className="py-3">
                            <p className="text-xs text-primary font-medium mb-1">
                                {yearsAgo} year{yearsAgo !== 1 ? 's' : ''} ago
                            </p>
                            <p className="text-sm line-clamp-3">{entry.body}</p>
                            {entry.moodEmoji && <span className="text-lg mt-1 inline-block">{entry.moodEmoji}</span>}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
