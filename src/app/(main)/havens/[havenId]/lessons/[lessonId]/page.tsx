'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LessonForm } from '@/components/lessons/lesson-form';
import { lessonsApi } from '@/lib/api/lessons';
import type { Lesson } from '@/lib/types/lesson';
import { ArrowLeft, Pencil, Trash2, Calendar, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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

export default function LessonDetailPage() {
    const params = useParams();
    const router = useRouter();
    const havenId = params.havenId as string;
    const lessonId = params.lessonId as string;
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        lessonsApi
            .get(havenId, lessonId)
            .then(({ data: res }) => {
                if (res.success && res.data) setLesson(res.data);
            })
            .finally(() => setLoading(false));
    }, [havenId, lessonId]);

    const handleDelete = async () => {
        try {
            await lessonsApi.delete(havenId, lessonId);
            toast.success('Lesson deleted');
            router.push(`/havens/${havenId}/lessons`);
        } catch {
            toast.error('Failed to delete lesson');
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 rounded-lg" />
            </div>
        );
    }

    if (!lesson) {
        return <div className="text-center py-12 text-muted-foreground">Lesson not found.</div>;
    }

    if (editing) {
        return (
            <div className="py-2">
                <LessonForm havenId={havenId} lesson={lesson} />
            </div>
        );
    }

    const icon = CATEGORY_ICONS[lesson.category];

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1" />
                <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                    <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete lesson?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <Card>
                <CardContent className="py-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-xl shrink-0">
                            {icon ? icon : <GraduationCap className="h-6 w-6 text-primary" />}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{lesson.title}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="capitalize">{lesson.category}</Badge>
                                {lesson.ageRelevant && lesson.ageRelevant !== 'all' && (
                                    <Badge variant="outline" className="capitalize">{lesson.ageRelevant}</Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{lesson.body}</div>

                    {lesson.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                            {lesson.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(lesson.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        {lesson.authorDisplayName && <span>by {lesson.authorDisplayName}</span>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
