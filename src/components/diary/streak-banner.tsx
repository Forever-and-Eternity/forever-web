'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { diaryApi } from '@/lib/api/diary';
import type { DiaryStreak } from '@/lib/types/diary';
import { Flame } from 'lucide-react';

export function StreakBanner({ havenId }: { havenId: string }) {
    const [streak, setStreak] = useState<DiaryStreak | null>(null);

    useEffect(() => {
        diaryApi
            .getStreak(havenId)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setStreak(res.data);
                }
            })
            .catch(() => {});
    }, [havenId]);

    if (!streak) return null;

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                        <Flame className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-primary">{streak.currentStreak}</span>
                            <span className="text-sm text-muted-foreground">day streak</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Best: {streak.longestStreak} days
                            {streak.currentStreak === 0 && ' — Write today to start your streak!'}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
