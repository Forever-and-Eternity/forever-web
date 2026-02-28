'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentTypeLabels, AnnotationTypeLabels } from '@/lib/types/enums';
import type { FeedItem as FeedItemType } from '@/lib/types/feed';

export function FeedItem({ item }: { item: FeedItemType }) {
    return (
        <Card>
            {(item.thumbnailUrl || item.mediaUrl) && (
                <div className="overflow-hidden rounded-t-lg bg-muted">
                    <img
                        src={item.thumbnailUrl || item.mediaUrl!}
                        alt={item.title || 'Content'}
                        className="w-full max-h-96 object-contain"
                    />
                </div>
            )}
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{item.title || 'Untitled'}</h3>
                    <Badge variant="secondary" className="text-xs">
                        {ContentTypeLabels[item.contentType]}
                    </Badge>
                </div>
                {item.uploaderDisplayName && <p className="text-xs text-muted-foreground">by {item.uploaderDisplayName}</p>}
            </CardHeader>
            <CardContent className="space-y-3">
                {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}

                {item.peopleTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {item.peopleTags.map((tag) => (
                            <Badge key={tag.id} variant="outline" className="text-xs">
                                {tag.personDisplayName}
                            </Badge>
                        ))}
                    </div>
                )}

                {item.annotations.length > 0 && (
                    <div className="space-y-2 border-t pt-3">
                        {item.annotations.slice(0, 3).map((annotation) => (
                            <div key={annotation.id} className="text-sm">
                                <span className="font-medium">{AnnotationTypeLabels[annotation.annotationType]}:</span> {annotation.body}
                            </div>
                        ))}
                        {item.annotations.length > 3 && (
                            <p className="text-xs text-muted-foreground">+{item.annotations.length - 3} more annotations</p>
                        )}
                    </div>
                )}

                <div className="flex gap-2 text-xs text-muted-foreground">
                    {item.locationName && <span>{item.locationName}</span>}
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
            </CardContent>
        </Card>
    );
}
