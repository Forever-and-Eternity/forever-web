'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Lesson } from '@/lib/types/lesson';
import { GraduationCap } from 'lucide-react';

const CATEGORY_ICONS: Record<string, string> = {
    relationships: '\uD83D\uDC95',
    career: '\uD83D\uDCBC',
    health: '\uD83C\uDFE5',
    finances: '\uD83D\uDCB0',
    parenting: '\uD83D\uDC76',
    life: '\uD83C\uDF31',
    spirituality: '\uD83D\uDE4F',
    education: '\uD83D\uDCDA',
};

export function LessonCard({ lesson, havenId }: { lesson: Lesson; havenId: string }) {
    const icon = CATEGORY_ICONS[lesson.category];

    return (
        <Link href={`/havens/${havenId}/lessons/${lesson.id}`}>
            <Card className="hover:border-primary/30 transition-colors h-full">
                <CardContent className="py-4 space-y-2">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0 text-lg">
                            {icon ? icon : <GraduationCap className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{lesson.body}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs capitalize">{lesson.category}</Badge>
                        {lesson.ageRelevant && lesson.ageRelevant !== 'all' && (
                            <Badge variant="outline" className="text-xs capitalize">{lesson.ageRelevant}</Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
