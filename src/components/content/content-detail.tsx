'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { AnnotationList } from '@/components/annotations/annotation-list';
import { AnnotationForm } from '@/components/annotations/annotation-form';
import { PersonTagDialog } from '@/components/people/person-tag-dialog';
import { contentApi } from '@/lib/api/content';
import { ContentTypeLabels } from '@/lib/types/enums';
import type { ContentItem } from '@/lib/types/content';

export function ContentDetail({ havenId, contentId }: { havenId: string; contentId: string }) {
    const [item, setItem] = useState<ContentItem | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <Skeleton className="h-96 rounded-lg" />;
    if (!item) return <p>Content not found</p>;

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                {item.mediaUrl && (
                    <div className="overflow-hidden rounded-lg bg-muted">
                        <img src={item.mediaUrl} alt={item.title || 'Content'} className="w-full object-contain max-h-[600px]" />
                    </div>
                )}
                <div className="mt-4">
                    <h2 className="text-xl font-bold">{item.title || 'Untitled'}</h2>
                    {item.description && <p className="mt-1 text-muted-foreground">{item.description}</p>}
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
