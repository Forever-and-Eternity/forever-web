'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { annotationsApi } from '@/lib/api/annotations';
import { AnnotationTypeLabels } from '@/lib/types/enums';
import { toast } from 'sonner';
import type { Annotation } from '@/lib/types/annotation';

export function AnnotationList({
    annotations,
    contentId,
    onDeleted,
}: {
    annotations: Annotation[];
    contentId: string;
    onDeleted?: () => void;
}) {
    async function handleDelete(annotationId: string) {
        try {
            await annotationsApi.delete(contentId, annotationId);
            toast.success('Annotation deleted');
            onDeleted?.();
        } catch {
            toast.error('Failed to delete');
        }
    }

    if (annotations.length === 0) {
        return <p className="text-sm text-muted-foreground">No annotations yet.</p>;
    }

    return (
        <div className="space-y-3">
            {annotations.map((annotation) => (
                <div key={annotation.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                    {AnnotationTypeLabels[annotation.annotationType]}
                                </Badge>
                                {annotation.authorDisplayName && (
                                    <span className="text-xs text-muted-foreground">{annotation.authorDisplayName}</span>
                                )}
                            </div>
                            <p className="text-sm">{annotation.body}</p>
                            {annotation.photoLocation && <p className="mt-1 text-xs text-muted-foreground">{annotation.photoLocation}</p>}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(annotation.id)}>
                            Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
