'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DiaryEntryForm } from '@/components/diary/diary-entry-form';
import { diaryApi } from '@/lib/api/diary';
import type { DiaryEntry } from '@/lib/types/diary';
import { ArrowLeft, Pencil, Trash2, MapPin, Lock, Calendar } from 'lucide-react';
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

export default function DiaryEntryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const havenId = params.havenId as string;
    const entryId = params.entryId as string;
    const [entry, setEntry] = useState<DiaryEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        diaryApi
            .get(havenId, entryId)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setEntry(res.data);
                }
            })
            .finally(() => setLoading(false));
    }, [havenId, entryId]);

    const handleDelete = async () => {
        try {
            await diaryApi.delete(havenId, entryId);
            toast.success('Entry deleted');
            router.push(`/havens/${havenId}/journals`);
        } catch {
            toast.error('Failed to delete entry');
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

    if (!entry) {
        return <div className="text-center py-12 text-muted-foreground">Entry not found.</div>;
    }

    if (editing) {
        return (
            <div className="py-2">
                <DiaryEntryForm havenId={havenId} entry={entry} />
            </div>
        );
    }

    const date = new Date(entry.createdAt);

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
                            <AlertDialogTitle>Delete entry?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction variant="destructive" onClick={handleDelete}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <Card>
                <CardContent className="py-4 space-y-4">
                    {/* Header row */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {entry.moodEmoji && <span className="text-2xl">{entry.moodEmoji}</span>}
                        {entry.mood && (
                            <Badge variant="secondary" className="capitalize">
                                {entry.mood}
                            </Badge>
                        )}
                        {entry.isPrivate && (
                            <Badge variant="outline" className="text-xs">
                                <Lock className="h-3 w-3 mr-1" /> Private
                            </Badge>
                        )}
                    </div>

                    {/* Body */}
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{entry.body}</div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {date.toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                        {entry.locationName && (
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {entry.locationName}
                            </span>
                        )}
                    </div>

                    {/* Tags */}
                    {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {entry.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {entry.authorDisplayName && (
                        <p className="text-xs text-muted-foreground">Written by {entry.authorDisplayName}</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
