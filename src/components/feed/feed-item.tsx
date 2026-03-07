'use client';

import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Upload,
    Trash2,
    BookOpen,
    PenLine,
    Package,
    PackageOpen,
    GraduationCap,
    Heart,
    Pill,
    Shield,
    UserPlus,
    X,
    Activity,
} from 'lucide-react';
import type { FeedActivity } from '@/lib/types/feed';
import type { LucideIcon } from 'lucide-react';

const activityIconMap: Record<string, LucideIcon> = {
    content_uploaded: Upload,
    content_deleted: Trash2,
    diary_created: BookOpen,
    diary_updated: PenLine,
    capsule_created: Package,
    capsule_unlocked: PackageOpen,
    lesson_created: GraduationCap,
    health_condition_added: Heart,
    health_medication_added: Pill,
    keychain_entry_created: Shield,
    person_added: UserPlus,
};

const subjectRouteMap: Record<string, string> = {
    content: 'content',
    diary: 'journals',
    capsule: 'capsules',
    lesson: 'lessons',
    person: 'people',
    condition: 'health',
    medication: 'health',
    keychain: 'vault',
};

function timeAgo(date: string): string {
    const seconds = Math.floor(
        (Date.now() - new Date(date).getTime()) / 1000,
    );
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}

interface FeedItemProps {
    item: FeedActivity;
    onDismiss: (id: string) => void;
}

export function FeedItemCard({ item, onDismiss }: FeedItemProps) {
    const router = useRouter();
    const params = useParams();
    const havenId = params.havenId as string;

    const Icon = activityIconMap[item.activityType] || Activity;

    const thumbnailUrl = item.metadata?.thumbnailUrl as string | undefined;
    const moodEmoji = item.metadata?.moodEmoji as string | undefined;
    const emoji = item.metadata?.emoji as string | undefined;

    function handleClick() {
        if (!item.subjectType || !item.subjectId) return;

        const routeSegment = subjectRouteMap[item.subjectType];
        if (!routeSegment) return;

        // health and vault routes don't have an individual ID path
        if (item.subjectType === 'condition' || item.subjectType === 'medication') {
            router.push(`/havens/${havenId}/${routeSegment}`);
        } else if (item.subjectType === 'keychain') {
            router.push(`/havens/${havenId}/${routeSegment}`);
        } else {
            router.push(`/havens/${havenId}/${routeSegment}/${item.subjectId}`);
        }
    }

    function handleDismiss(e: React.MouseEvent) {
        e.stopPropagation();
        onDismiss(item.id);
    }

    return (
        <Card
            className="relative cursor-pointer transition-colors hover:bg-accent/40 py-4"
            onClick={handleClick}
        >
            {/* Dismiss button */}
            <Button
                variant="ghost"
                size="icon-xs"
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                onClick={handleDismiss}
                aria-label="Dismiss activity"
            >
                <X className="size-3.5" />
            </Button>

            <CardContent className="flex gap-4 items-start">
                {/* Icon */}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" />
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                        {/* User avatar or initials */}
                        {item.userAvatarUrl ? (
                            <img
                                src={item.userAvatarUrl}
                                alt={item.userDisplayName}
                                className="size-5 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                                {item.userDisplayName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="text-xs text-muted-foreground truncate">
                            {item.userDisplayName}
                        </span>
                        <span className="text-xs text-muted-foreground/60">
                            {timeAgo(item.createdAt)}
                        </span>
                    </div>

                    <p className="text-sm font-medium leading-snug">
                        {(moodEmoji || emoji) && (
                            <span className="mr-1.5">{moodEmoji || emoji}</span>
                        )}
                        {item.title}
                    </p>

                    {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                        </p>
                    )}
                </div>

                {/* Thumbnail */}
                {thumbnailUrl && (
                    <div className="shrink-0">
                        <img
                            src={thumbnailUrl}
                            alt=""
                            className="size-14 rounded-md object-cover"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
