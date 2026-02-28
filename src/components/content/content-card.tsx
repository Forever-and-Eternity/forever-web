'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentTypeLabels } from '@/lib/types/enums';
import type { ContentItem } from '@/lib/types/content';

export function ContentCard({ item, havenId }: { item: ContentItem; havenId: string }) {
    return (
        <Link href={`/havens/${havenId}/content/${item.id}`}>
            <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-square bg-muted">
                    {item.thumbnailUrl || item.mediaUrl ? (
                        <img
                            src={item.thumbnailUrl || item.mediaUrl!}
                            alt={item.title || 'Content'}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            {ContentTypeLabels[item.contentType]}
                        </div>
                    )}
                </div>
                <CardContent className="p-3">
                    <p className="truncate text-sm font-medium">{item.title || 'Untitled'}</p>
                    <div className="mt-1 flex gap-1">
                        <Badge variant="secondary" className="text-xs">
                            {ContentTypeLabels[item.contentType]}
                        </Badge>
                        {item.annotations.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                                {item.annotations.length} notes
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
