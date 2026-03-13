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

function formatTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function ContentCard({ item, havenId }: { item: ContentItem; havenId: string }) {
    const Icon = contentTypeIcons[item.contentType] || FileType;
    const iconColor = contentTypeColors[item.contentType] || 'text-muted-foreground';

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
                <div className="aspect-[4/3] bg-muted">
                    {canShowImage && previewUrl ? (
                        <img
                            src={previewUrl}
                            alt={item.title || 'Content'}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
                            <Icon className={`size-8 sm:size-10 ${iconColor}`} />
                            <span className="text-[10px] sm:text-xs font-medium px-2 text-center line-clamp-2 max-w-full">
                                {item.title || ContentTypeLabels[item.contentType]}
                            </span>
                        </div>
                    )}
                </div>
                <CardContent className="p-2 sm:p-3">
                    <p className="truncate text-xs sm:text-sm font-medium">{item.title || 'Untitled'}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                        Uploaded {formatDate(item.createdAt)} @ {formatTime(item.createdAt)}
                    </p>
                    {item.fileSize > 0 && (
                        <p className="text-[10px] text-muted-foreground truncate">
                            {formatBytes(item.fileSize)}
                        </p>
                    )}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                        <Badge className="text-[10px] sm:text-xs px-1.5 py-0 bg-primary/15 text-primary border-primary/30 hover:bg-primary/20">
                            {ContentTypeLabels[item.contentType]}
                        </Badge>
                        {item.annotations.length > 0 && (
                            <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0">
                                {item.annotations.length} notes
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
