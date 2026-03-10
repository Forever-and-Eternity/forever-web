import { Users, Image, BookOpen, Clock, Lightbulb, HardDrive } from 'lucide-react';
import type { Haven } from '@/lib/types/haven';

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths}mo ago`;
}

export function HavenHoverPreview({ haven }: { haven: Haven }) {
    const stats = [
        { icon: Image, label: 'Content', value: haven.contentCount },
        { icon: Users, label: 'People', value: haven.peopleCount },
        { icon: BookOpen, label: 'Diary', value: haven.diaryCount },
        { icon: Clock, label: 'Capsules', value: haven.capsuleCount },
        { icon: Lightbulb, label: 'Lessons', value: haven.lessonCount },
    ];

    return (
        <div className="space-y-3">
            <div>
                <p className="font-semibold text-sm">{haven.name}</p>
                {haven.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{haven.description}</p>
                )}
            </div>

            <div className="grid grid-cols-3 gap-2">
                {stats.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Icon className="h-3.5 w-3.5" />
                        <span>{value} {label}</span>
                    </div>
                ))}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <HardDrive className="h-3.5 w-3.5" />
                    <span>{formatBytes(haven.storageSizeBytes)}</span>
                </div>
            </div>

            {haven.lastActivityAt && (
                <p className="text-xs text-muted-foreground border-t pt-2">
                    Last activity: {formatRelativeTime(haven.lastActivityAt)}
                </p>
            )}
        </div>
    );
}
