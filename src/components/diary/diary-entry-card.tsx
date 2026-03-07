'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DiaryEntry } from '@/lib/types/diary';
import { Lock, MapPin } from 'lucide-react';

export function DiaryEntryCard({ entry, havenId }: { entry: DiaryEntry; havenId: string }) {
    const date = new Date(entry.createdAt);
    const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
    const dayNum = date.getDate();
    const monthYear = date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });

    return (
        <Link href={`/havens/${havenId}/journals/${entry.id}`}>
            <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="py-3">
                    <div className="flex gap-3">
                        {/* Date column */}
                        <div className="flex flex-col items-center justify-start pt-0.5 min-w-[44px]">
                            <span className="text-xs text-muted-foreground">{dayName}</span>
                            <span className="text-xl font-bold">{dayNum}</span>
                            <span className="text-[10px] text-muted-foreground">{monthYear}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2">
                                {entry.moodEmoji && <span className="text-lg">{entry.moodEmoji}</span>}
                                {entry.mood && (
                                    <Badge variant="secondary" className="text-xs capitalize">
                                        {entry.mood}
                                    </Badge>
                                )}
                                {entry.isPrivate && <Lock className="h-3 w-3 text-muted-foreground" />}
                            </div>
                            <p className="text-sm line-clamp-3">{entry.body}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                {entry.locationName && (
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {entry.locationName}
                                    </span>
                                )}
                                {entry.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-[10px] py-0">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
