'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Film, Mic, FileType, ImageIcon } from 'lucide-react';
import { ContentType, ContentTypeLabels } from '@/lib/types/enums';
import type { ContentItem } from '@/lib/types/content';

const contentTypeIcons: Record<ContentType, React.ElementType> = {
    [ContentType.Photo]: ImageIcon,
    [ContentType.Video]: Film,
    [ContentType.Audio]: Mic,
    [ContentType.Text]: FileType,
    [ContentType.Document]: FileText,
};

const contentTypeColors: Record<ContentType, string> = {
    [ContentType.Photo]: 'text-blue-500',
    [ContentType.Video]: 'text-purple-500',
    [ContentType.Audio]: 'text-amber-500',
    [ContentType.Text]: 'text-emerald-500',
    [ContentType.Document]: 'text-rose-500',
};

function isImageUrl(url: string): boolean {
    const lower = url.toLowerCase();
    return /\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)(\?|$)/.test(lower);
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ContentCard({ item, havenId }: { item: ContentItem; havenId: string }) {
    const Icon = contentTypeIcons[item.contentType] || FileType;
    const iconColor = contentTypeColors[item.contentType] || 'text-muted-foreground';

    // Determine if we can show an image preview
    const canShowImage =
        (item.thumbnailUrl && isImageUrl(item.thumbnailUrl)) ||
        (item.contentType === ContentType.Photo && item.mediaUrl && isImageUrl(item.mediaUrl));

    const previewUrl = item.thumbnailUrl && isImageUrl(item.thumbnailUrl)
        ? item.thumbnailUrl
        : item.contentType === ContentType.Photo && item.mediaUrl
            ? item.mediaUrl
            : null;

    return (
        <Link href={`/havens/${havenId}/content/${item.id}`}>
            <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-square bg-muted">
                    {canShowImage && previewUrl ? (
                        <img
                            src={previewUrl}
                            alt={item.title || 'Content'}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Icon className={`size-10 ${iconColor}`} />
                            <span className="text-xs font-medium px-3 text-center truncate max-w-full">
                                {item.title || ContentTypeLabels[item.contentType]}
                            </span>
                        </div>
                    )}
                </div>
                <CardContent className="p-3">
                    <p className="truncate text-sm font-medium">{item.title || 'Untitled'}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(item.createdAt)}</p>
                    <div className="mt-1.5 flex gap-1">
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
