'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    Camera,
    Loader2,
    ImageIcon,
    Users,
    Activity,
    UserCog,
    BookOpen,
    TimerIcon,
    GraduationCap,
    HeartPulse,
    KeyRound,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageCropDialog } from '@/components/settings/avatar-crop-dialog';
import { FeedItemCard } from '@/components/feed/feed-item';
import { havensApi } from '@/lib/api/havens';
import { feedApi } from '@/lib/api/feed';
import { useHavenStore } from '@/lib/stores/haven-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';
import type { FeedActivity } from '@/lib/types/feed';

const SECTION_ICONS: Record<string, React.ElementType> = {
    Content: ImageIcon,
    People: Users,
    Members: UserCog,
    Journals: BookOpen,
    Capsules: TimerIcon,
    Lessons: GraduationCap,
    Health: HeartPulse,
    Vault: KeyRound,
};

const SECTION_COLORS: Record<string, string> = {
    Content: 'border-primary/30 hover:border-primary/50',
    People: 'border-pink-500/30 hover:border-pink-500/50',
    Members: 'border-violet-500/30 hover:border-violet-500/50',
    Journals: 'border-amber-500/30 hover:border-amber-500/50',
    Capsules: 'border-cyan-500/30 hover:border-cyan-500/50',
    Lessons: 'border-emerald-500/30 hover:border-emerald-500/50',
    Health: 'border-rose-500/30 hover:border-rose-500/50',
    Vault: 'border-indigo-500/30 hover:border-indigo-500/50',
};

const SECTION_ICON_COLORS: Record<string, string> = {
    Content: 'text-primary',
    People: 'text-pink-500',
    Members: 'text-violet-500',
    Journals: 'text-amber-500',
    Capsules: 'text-cyan-500',
    Lessons: 'text-emerald-500',
    Health: 'text-rose-500',
    Vault: 'text-indigo-500',
};

export default function HavenDetailPage() {
    const params = useParams();
    const havenId = params.havenId as string;
    const haven = useHavenStore((s) => s.currentHaven);
    const updateHaven = useHavenStore((s) => s.updateHaven);
    const user = useAuthStore((s) => s.user);

    const [coverUploading, setCoverUploading] = useState(false);
    const [cropFile, setCropFile] = useState<File | null>(null);
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Feed preview
    const [feedItems, setFeedItems] = useState<FeedActivity[]>([]);
    const [feedLoading, setFeedLoading] = useState(true);

    useEffect(() => {
        if (!havenId) return;
        setFeedLoading(true);
        feedApi
            .getActivities(havenId, 1, 8)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setFeedItems(res.data.items);
                }
            })
            .finally(() => setFeedLoading(false));
    }, [havenId]);

    if (!haven || haven.id !== havenId) return <Skeleton className="h-64 rounded-lg" />;

    const isOwner = user?.id === haven.ownerId;

    function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image must be under 10MB');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setCropFile(file);
        setCropDialogOpen(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    async function handleCropComplete(blob: Blob) {
        setCropDialogOpen(false);
        setCropFile(null);
        setCoverUploading(true);
        try {
            const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' });
            const updatedHaven = await havensApi.uploadCover(havenId, file);
            if (updatedHaven) {
                updateHaven(havenId, updatedHaven);
                toast.success('Cover image updated');
            } else {
                toast.error('Failed to upload cover image');
            }
        } catch {
            toast.error('Failed to upload cover image');
        } finally {
            setCoverUploading(false);
        }
    }

    function handleCropCancel() {
        setCropDialogOpen(false);
        setCropFile(null);
    }

    const sections = [
        { label: 'Content', href: `/havens/${havenId}/content`, count: haven.contentCount, desc: 'Photos & documents' },
        { label: 'People', href: `/havens/${havenId}/people`, count: haven.peopleCount, desc: 'Tagged people' },
        { label: 'Members', href: `/havens/${havenId}/members`, count: haven.memberCount, desc: 'Haven members' },
        { label: 'Journals', href: `/havens/${havenId}/journals`, count: haven.diaryCount, desc: 'Diary entries' },
        { label: 'Capsules', href: `/havens/${havenId}/capsules`, count: haven.capsuleCount, desc: 'Time capsules' },
        { label: 'Lessons', href: `/havens/${havenId}/lessons`, count: haven.lessonCount, desc: 'Life lessons' },
        { label: 'Health', href: `/havens/${havenId}/health`, count: null, desc: 'Medical records' },
        { label: 'Vault', href: `/havens/${havenId}/vault`, count: null, desc: 'Secure keychain' },
    ];

    return (
        <div>
            {/* Cover banner */}
            <div className="relative mb-6 h-40 sm:h-52 w-full overflow-hidden rounded-xl bg-gradient-ig">
                {haven.coverImageUrl ? (
                    <img
                        src={haven.coverImageUrl}
                        alt={`${haven.name} cover`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <span className="text-4xl font-bold text-white/80">{haven.name}</span>
                    </div>
                )}
                {isOwner && (
                    <>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={coverUploading}
                            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-opacity hover:bg-black/70"
                        >
                            {coverUploading ? (
                                <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                                <Camera className="size-3.5" />
                            )}
                            {haven.coverImageUrl ? 'Change cover' : 'Add cover'}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelected}
                        />
                    </>
                )}
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold">{haven.name}</h2>
                {haven.description && <p className="mt-1 text-muted-foreground">{haven.description}</p>}
            </div>

            {/* Mobile: horizontal scrollable section nav at bottom is handled via mobile nav below */}
            {/* Desktop: Feed left + section grid right */}
            <div className="hidden md:grid md:grid-cols-[1fr_1.2fr] gap-5">
                {/* Feed panel - left, larger */}
                <Link href={`/havens/${havenId}/feed`} className="block">
                    <Card className="h-full border-2 border-primary/20 hover:border-primary/40 transition-colors">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Activity className="size-5 text-primary" />
                                <CardTitle className="text-lg">Activity Feed</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2.5">
                            {feedLoading ? (
                                <>
                                    <Skeleton className="h-12 rounded" />
                                    <Skeleton className="h-12 rounded" />
                                    <Skeleton className="h-12 rounded" />
                                </>
                            ) : feedItems.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">No recent activity</p>
                            ) : (
                                <>
                                    {feedItems.slice(0, 6).map((item) => (
                                        <FeedItemCard key={item.id} activity={item} compact />
                                    ))}
                                    {feedItems.length > 6 && (
                                        <p className="text-xs text-muted-foreground text-center pt-1">
                                            +{feedItems.length - 6} more activities
                                        </p>
                                    )}
                                </>
                            )}
                            <div className="pt-2">
                                <Button variant="outline" size="sm" className="w-full">
                                    View all activity
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Section grid - right */}
                <div className="grid grid-cols-2 gap-3">
                    {sections.map(({ label, href, count, desc }) => {
                        const Icon = SECTION_ICONS[label];
                        const borderClass = SECTION_COLORS[label];
                        const iconColor = SECTION_ICON_COLORS[label];
                        return (
                            <Link key={label} href={href}>
                                <Card className={`h-full border-2 transition-all hover:shadow-md ${borderClass}`}>
                                    <CardContent className="p-4 flex flex-col gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <Icon className={`size-5 ${iconColor}`} />
                                            <span className="font-semibold text-sm">{label}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{desc}</p>
                                        {count !== null && (
                                            <p className="text-xl font-bold mt-auto">{count}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Mobile layout: full feed (bottom nav is in layout) */}
            <div className="md:hidden">
                <div className="space-y-2">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Activity className="size-5 text-primary" />
                            <h3 className="text-base font-semibold">Activity Feed</h3>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/havens/${havenId}/feed`}>View all</Link>
                        </Button>
                    </div>
                    {feedLoading ? (
                        <>
                            <Skeleton className="h-12 rounded" />
                            <Skeleton className="h-12 rounded" />
                            <Skeleton className="h-12 rounded" />
                        </>
                    ) : feedItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-8 text-center">No recent activity</p>
                    ) : (
                        feedItems.map((item) => (
                            <FeedItemCard key={item.id} activity={item} compact />
                        ))
                    )}
                </div>
            </div>

            <ImageCropDialog
                open={cropDialogOpen}
                imageFile={cropFile}
                onCropComplete={handleCropComplete}
                onCancel={handleCropCancel}
                title="Crop Cover Image"
                cropShape="rect"
                aspect={16 / 9}
                outputWidth={1200}
                outputHeight={675}
            />
        </div>
    );
}
