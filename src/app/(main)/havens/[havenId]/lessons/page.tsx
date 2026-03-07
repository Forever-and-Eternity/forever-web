'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LessonLibrary } from '@/components/lessons/lesson-library';
import { Plus } from 'lucide-react';

export default function LessonsPage() {
    const params = useParams();
    const havenId = params.havenId as string;

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">Life Lessons</h1>
                    <p className="text-sm text-muted-foreground">Wisdom for the ones you love.</p>
                </div>
                <Button size="sm" asChild>
                    <Link href={`/havens/${havenId}/lessons/new`}>
                        <Plus className="h-4 w-4 mr-1" />
                        New Lesson
                    </Link>
                </Button>
            </div>
            <LessonLibrary havenId={havenId} />
        </div>
    );
}
