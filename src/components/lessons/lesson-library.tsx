'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LessonCard } from './lesson-card';
import { AgeTimeline } from './age-timeline';
import { lessonsApi } from '@/lib/api/lessons';
import type { Lesson, LessonCategory } from '@/lib/types/lesson';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export function LessonLibrary({ havenId }: { havenId: string }) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [categories, setCategories] = useState<LessonCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
    const [selectedAge, setSelectedAge] = useState<string | undefined>();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        lessonsApi.getCategories(havenId).then(({ data: res }) => {
            if (res.success && res.data) setCategories(res.data);
        });
    }, [havenId]);

    useEffect(() => {
        setLoading(true);
        setPage(1);
        lessonsApi
            .list(havenId, 1, 20, selectedCategory, selectedAge)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setLessons(res.data.items);
                    setHasMore(res.data.hasNextPage);
                }
            })
            .finally(() => setLoading(false));
    }, [havenId, selectedCategory, selectedAge]);

    const loadMore = () => {
        const nextPage = page + 1;
        lessonsApi.list(havenId, nextPage, 20, selectedCategory, selectedAge).then(({ data: res }) => {
            if (res.success && res.data) {
                setLessons((prev) => [...prev, ...res.data!.items]);
                setHasMore(res.data.hasNextPage);
                setPage(nextPage);
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* Category filter */}
            {categories.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                    <button
                        type="button"
                        onClick={() => setSelectedCategory(undefined)}
                        className={`shrink-0 snap-start rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                            !selectedCategory
                                ? 'bg-primary/15 border-primary text-primary'
                                : 'border-border text-muted-foreground hover:bg-accent'
                        }`}
                    >
                        All ({categories.reduce((s, c) => s + c.count, 0)})
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.category}
                            type="button"
                            onClick={() => setSelectedCategory(selectedCategory === cat.category ? undefined : cat.category)}
                            className={`shrink-0 snap-start rounded-full px-3 py-1.5 text-xs font-medium border transition-colors capitalize ${
                                selectedCategory === cat.category
                                    ? 'bg-primary/15 border-primary text-primary'
                                    : 'border-border text-muted-foreground hover:bg-accent'
                            }`}
                        >
                            {cat.category} ({cat.count})
                        </button>
                    ))}
                </div>
            )}

            {/* Age filter */}
            <AgeTimeline selected={selectedAge} onSelect={setSelectedAge} />

            {loading ? (
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-28 rounded-lg" />
                    ))}
                </div>
            ) : lessons.length === 0 ? (
                <div className="text-center py-12">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground mb-4">No lessons yet.</p>
                    <Button asChild>
                        <Link href={`/havens/${havenId}/lessons/new`}>Share your first lesson</Link>
                    </Button>
                </div>
            ) : (
                <>
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                        {lessons.map((lesson) => (
                            <LessonCard key={lesson.id} lesson={lesson} havenId={havenId} />
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
