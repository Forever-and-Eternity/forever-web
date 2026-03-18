'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { FileText, Film, Mic, FileType, ImageIcon, Lock } from 'lucide-react';
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
    return /\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)(\?|$)/i.test(url);
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function ContentListItem({ item, havenId }: { item: ContentItem; havenId: string }) {
    const Icon = contentTypeIcons[item.contentType] || FileType;
    const iconColor = contentTypeColors[item.contentType] || 'text-muted-foreground';

    const previewUrl =
        (item.thumbnailUrl && isImageUrl(item.thumbnailUrl))
            ? item.thumbnailUrl
            : (item.contentType === ContentType.Photo && item.mediaUrl && isImageUrl(item.mediaUrl))
                ? item.mediaUrl
                : null;

    return (
        <Link href={`/havens/${havenId}/content/${item.id}`}>
            <div className="flex items-center gap-3 rounded-lg border bg-card p-2.5 transition-colors hover:bg-accent/50">
                {/* Thumbnail */}
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                    {previewUrl ? (
                        <img src={previewUrl} alt={item.title || 'Content'} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Icon className={`h-5 w-5 ${iconColor}`} />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{item.title || 'Untitled'}</p>
                        {item.isEncrypted && <Lock className="h-3 w-3 shrink-0 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                        {formatDate(item.createdAt)} &middot; {formatBytes(item.fileSize || 0)}
                        {item.uploaderDisplayName && ` \u00B7 by ${item.uploaderDisplayName}`}
                    </p>
                </div>

                {/* Badges */}
                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                    <Badge className="text-xs px-1.5 py-0 bg-primary/15 text-primary border-primary/30">
                        {ContentTypeLabels[item.contentType]}
                    </Badge>
                    {item.annotations.length > 0 && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {item.annotations.length} notes
                        </Badge>
                    )}
                </div>
            </div>
        </Link>
    );
}
