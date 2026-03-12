'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
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
import { AnnotationList } from '@/components/annotations/annotation-list';
import { AnnotationForm } from '@/components/annotations/annotation-form';
import { PersonTagDialog } from '@/components/people/person-tag-dialog';
import { contentApi } from '@/lib/api/content';
import { ContentType, ContentTypeLabels } from '@/lib/types/enums';
import type { ContentItem } from '@/lib/types/content';
import { toast } from 'sonner';

export function ContentDetail({ havenId, contentId }: { havenId: string; contentId: string }) {
    const router = useRouter();
    const [item, setItem] = useState<ContentItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    function refresh() {
        contentApi.get(havenId, contentId).then(({ data: res }) => {
            if (res.success && res.data) setItem(res.data);
        });
    }

    useEffect(() => {
        contentApi
            .get(havenId, contentId)
            .then(({ data: res }) => {
                if (res.success && res.data) setItem(res.data);
            })
            .finally(() => setLoading(false));
    }, [havenId, contentId]);

    async function handleDelete() {
        setDeleting(true);
        try {
            const { data: res } = await contentApi.delete(havenId, contentId);
            if (res.success) {
                toast.success('Content deleted');
                router.push(`/havens/${havenId}/content`);
            } else {
                toast.error('Failed to delete content');
            }
        } catch {
            toast.error('Failed to delete content');
        } finally {
            setDeleting(false);
        }
    }

    if (loading) return <Skeleton className="h-96 rounded-lg" />;
    if (!item) return <p>Content not found</p>;

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                {item.mediaUrl && (
                    <div className="overflow-hidden rounded-lg bg-muted">
                        {item.contentType === ContentType.Document ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                                <p className="text-sm text-muted-foreground">{item.title || 'Document'}</p>
                                <a
                                    href={item.mediaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                                >
                                    Open Document
                                </a>
                            </div>
                        ) : item.thumbnailUrl || item.mediaUrl ? (
                            <img src={item.thumbnailUrl || item.mediaUrl} alt={item.title || 'Content'} className="w-full object-contain max-h-[600px]" />
                        ) : null}
                    </div>
                )}
                <div className="mt-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold">{item.title || 'Untitled'}</h2>
                            {item.description && <p className="mt-1 text-muted-foreground">{item.description}</p>}
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete content?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently remove this content and all its annotations. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                                        {deleting ? 'Deleting...' : 'Delete'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge>{ContentTypeLabels[item.contentType]}</Badge>
                        {item.uploaderDisplayName && <Badge variant="outline">by {item.uploaderDisplayName}</Badge>}
                        {item.locationName && <Badge variant="secondary">{item.locationName}</Badge>}
                    </div>
                </div>

                {item.peopleTags.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Tagged People</h3>
                        <div className="flex flex-wrap gap-2">
                            {item.peopleTags.map((tag) => (
                                <Badge key={tag.id} variant="outline">
                                    {tag.personDisplayName}
                                    {tag.relationship && ` (${tag.relationship})`}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Annotations</h3>
                    <PersonTagDialog contentId={contentId} havenId={havenId} onTagged={refresh} />
                </div>
                <AnnotationForm contentId={contentId} onCreated={refresh} />
                <Separator />
                <AnnotationList annotations={item.annotations} contentId={contentId} onDeleted={refresh} />
            </div>
        </div>
    );
}
