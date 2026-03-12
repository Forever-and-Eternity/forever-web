'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useHavenStore } from '@/lib/stores/haven-store';
import { havensApi } from '@/lib/api/havens';
import { capsulesApi } from '@/lib/api/capsules';
import { diaryApi } from '@/lib/api/diary';
import { contentApi } from '@/lib/api/content';
import { ContentType } from '@/lib/types/enums';
import type { Capsule } from '@/lib/types/capsule';
import type { DiaryStreak } from '@/lib/types/diary';
import type { ContentItem } from '@/lib/types/content';
import { cn } from '@/lib/utils';
import {
    Plus,
    Upload,
    CalendarDays,
    Flame,
    Images,
    Users,
    ChevronRight,
    Lock,
    Unlock,
    Clock,
    Sparkles,
} from 'lucide-react';

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function formatCapsuleDate(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Past due';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
}

function MemoryCarousel({ photos }: { photos: ContentItem[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (photos.length <= 1) return;
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % photos.length);
        }, 4000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [photos.length]);

    if (photos.length === 0) return null;

    const photo = photos[currentIndex];
    const imgUrl = photo.thumbnailUrl || photo.mediaUrl;

    return (
        <div className="relative h-full w-full overflow-hidden">
            <img
                key={photo.id}
                src={imgUrl!}
                alt={photo.title || 'Memory'}
                className="h-full w-full object-cover transition-opacity duration-1000 animate-in fade-in"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="size-4 text-amber-300" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                        Remember this...
                    </p>
                </div>
                {photo.title && (
                    <p className="text-sm font-medium line-clamp-1">{photo.title}</p>
                )}
            </div>
            {photos.length > 1 && (
                <div className="absolute bottom-2 right-3 flex gap-1">
                    {photos.map((_, i) => (
                        <span
                            key={i}
                            className={cn(
                                'size-1.5 rounded-full transition-all',
                                i === currentIndex ? 'bg-white scale-110' : 'bg-white/40',
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const { havens, setHavens } = useHavenStore();
    const [loading, setLoading] = useState(true);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [greeting, setGreeting] = useState('Welcome');

    useEffect(() => {
        setGreeting(getGreeting());
    }, []);

    // Capsules across all havens
    const [capsules, setCapsules] = useState<(Capsule & { havenName: string })[]>([]);
    const [capsulesLoading, setCapsulesLoading] = useState(true);

    // Diary streak
    const [streak, setStreak] = useState<DiaryStreak | null>(null);
    const [streakLoading, setStreakLoading] = useState(true);

    // Photos for "Remember this..."
    const [photos, setPhotos] = useState<ContentItem[]>([]);
    const [photosLoading, setPhotosLoading] = useState(true);

    // Fetch havens
    useEffect(() => {
        havensApi
            .list(1, 100)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setHavens(res.data.items);
                }
            })
            .finally(() => setLoading(false));
    }, [setHavens]);

    // Fetch capsules from all havens once havens are loaded
    useEffect(() => {
        if (havens.length === 0 || loading) return;

        setCapsulesLoading(true);
        const promises = havens.map(async (haven) => {
            try {
                const { data: res } = await capsulesApi.list(haven.id, 1, 10, 'locked');
                if (res.success && res.data) {
                    return res.data.items.map((c) => ({ ...c, havenName: haven.name }));
                }
            } catch {
                // ignore
            }
            return [];
        });

        Promise.all(promises)
            .then((results) => {
                const all = results.flat();
                // Sort by unlockAt date, soonest first
                all.sort((a, b) => {
                    if (!a.unlockAt && !b.unlockAt) return 0;
                    if (!a.unlockAt) return 1;
                    if (!b.unlockAt) return -1;
                    return new Date(a.unlockAt).getTime() - new Date(b.unlockAt).getTime();
                });
                setCapsules(all);
            })
            .finally(() => setCapsulesLoading(false));
    }, [havens, loading]);

    // Fetch diary streak from first haven
    useEffect(() => {
        if (havens.length === 0 || loading) return;

        setStreakLoading(true);
        diaryApi
            .getStreak(havens[0].id)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setStreak(res.data);
                }
            })
            .catch(() => {
                // API might not have streak endpoint yet - compute from entries
                diaryApi.list(havens[0].id, 1, 30).then(({ data: res }) => {
                    if (res.success && res.data && res.data.items.length > 0) {
                        // Calculate streak from entries
                        const entries = res.data.items;
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        let currentStreak = 0;
                        let checkDate = new Date(today);

                        for (let i = 0; i < 30; i++) {
                            const dateStr = checkDate.toISOString().slice(0, 10);
                            const hasEntry = entries.some(
                                (e) => e.createdAt.slice(0, 10) === dateStr,
                            );
                            if (hasEntry) {
                                currentStreak++;
                                checkDate.setDate(checkDate.getDate() - 1);
                            } else if (i === 0) {
                                // No entry today, check if yesterday had one
                                checkDate.setDate(checkDate.getDate() - 1);
                                continue;
                            } else {
                                break;
                            }
                        }

                        setStreak({
                            currentStreak,
                            longestStreak: currentStreak,
                            lastEntryDate: entries[0]?.createdAt,
                        });
                    } else {
                        setStreak({ currentStreak: 0, longestStreak: 0 });
                    }
                });
            })
            .finally(() => setStreakLoading(false));
    }, [havens, loading]);

    // Fetch random photos for carousel
    useEffect(() => {
        if (havens.length === 0 || loading) return;

        setPhotosLoading(true);
        // Get photos from a haven that has content
        const havenWithContent = havens.find((h) => (h.contentCount ?? 0) > 0) || havens[0];
        contentApi
            .list(havenWithContent.id, 1, 12, ContentType.Photo)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    // Shuffle and take up to 6
                    const shuffled = res.data.items
                        .filter((item) => item.thumbnailUrl || item.mediaUrl)
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 6);
                    setPhotos(shuffled);
                }
            })
            .finally(() => setPhotosLoading(false));
    }, [havens, loading]);

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Welcome Header */}
            <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 ring-2 ring-primary/30">
                    {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName} />}
                    <AvatarFallback className="text-sm font-bold bg-gradient-ig text-white">
                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {greeting}
                    </p>
                    <h1
                        className="text-xl font-bold truncate"
                        style={{ fontFamily: 'var(--font-display-var), sans-serif' }}
                    >
                        {user?.displayName?.split(' ')[0] || 'there'}
                    </h1>
                </div>
            </div>

            {/* On This Day / Remember This */}
            <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    {photos.length > 0 ? 'Remember This...' : 'On This Day'}
                </h2>
                <Card className="py-0 overflow-hidden">
                    {photosLoading ? (
                        <Skeleton className="h-48 sm:h-56 w-full" />
                    ) : photos.length > 0 ? (
                        <div className="h-48 sm:h-56">
                            <MemoryCarousel photos={photos} />
                        </div>
                    ) : (
                        <div className="relative py-10 sm:py-14 bg-gradient-to-br from-primary/20 via-accent/30 to-primary/10 flex items-center justify-center">
                            <div className="text-center px-6">
                                <CalendarDays className="h-10 w-10 mx-auto text-primary/50 mb-3" />
                                <p className="text-sm text-muted-foreground">
                                    No memories yet for today.
                                </p>
                                <p className="text-xs text-muted-foreground/70 mt-1">
                                    Memories from previous years will appear here.
                                </p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Upcoming Capsules */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                        Upcoming Capsules
                    </h2>
                    {capsules.length > 0 && havens.length > 0 && (
                        <Link
                            href={`/havens/${havens[0].id}/capsules`}
                            className="text-xs text-primary font-medium"
                        >
                            View All
                        </Link>
                    )}
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                    {capsulesLoading ? (
                        <>
                            <Skeleton className="min-w-[200px] h-28 rounded-lg flex-shrink-0" />
                            <Skeleton className="min-w-[200px] h-28 rounded-lg flex-shrink-0" />
                        </>
                    ) : capsules.length === 0 ? (
                        <Link href={havens.length > 0 ? `/havens/${havens[0].id}/capsules/new` : '/havens/new'}>
                            <Card className="min-w-[200px] sm:min-w-[220px] flex-shrink-0 snap-start border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                                <CardContent className="py-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <Lock className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm truncate">No capsules yet</p>
                                            <p className="text-xs text-muted-foreground">Create your first</p>
                                        </div>
                                    </div>
                                    <div className="rounded-md bg-primary/10 px-3 py-1.5 text-center">
                                        <span className="text-xs font-medium text-primary">Get Started</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ) : (
                        capsules.slice(0, 6).map((capsule) => (
                            <Link
                                key={capsule.id}
                                href={`/havens/${capsule.havenId}/capsules/${capsule.id}`}
                            >
                                <Card className="min-w-[200px] sm:min-w-[220px] flex-shrink-0 snap-start border-cyan-500/20 hover:border-cyan-500/40 transition-colors cursor-pointer">
                                    <CardContent className="py-4 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-lg">
                                                {capsule.emoji || <Lock className="h-5 w-5 text-cyan-500" />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-sm truncate">{capsule.title}</p>
                                                <p className="text-xs text-muted-foreground truncate">{capsule.havenName}</p>
                                            </div>
                                        </div>
                                        {capsule.unlockAt && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Clock className="size-3" />
                                                <span>Unlocks in {formatCapsuleDate(capsule.unlockAt)}</span>
                                            </div>
                                        )}
                                        {capsule.lifeEvent && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Sparkles className="size-3" />
                                                <span className="truncate">{capsule.lifeEvent}</span>
                                            </div>
                                        )}
                                        {capsule.customEvent && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Sparkles className="size-3" />
                                                <span className="truncate">{capsule.customEvent}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Diary Streak */}
            <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    Diary Streak
                </h2>
                {streakLoading ? (
                    <Skeleton className="h-20 rounded-lg" />
                ) : (
                    <Link href={havens.length > 0 ? `/havens/${havens[0].id}/journals` : '#'}>
                        <Card className="border-amber-500/20 hover:border-amber-500/40 transition-colors">
                            <CardContent className="py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                                        <Flame className={cn(
                                            'h-5 w-5',
                                            streak && streak.currentStreak > 0
                                                ? 'text-amber-500'
                                                : 'text-muted-foreground',
                                        )} />
                                    </div>
                                    <div className="flex-1">
                                        {streak && streak.currentStreak > 0 ? (
                                            <>
                                                <div className="flex items-baseline gap-2">
                                                    <p className="text-2xl font-bold text-amber-500">
                                                        {streak.currentStreak}
                                                    </p>
                                                    <p className="text-sm font-medium">
                                                        {streak.currentStreak === 1 ? 'day' : 'days'}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {streak.lastEntryDate
                                                        ? `Last entry ${new Date(streak.lastEntryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                                        : 'Keep the streak going!'
                                                    }
                                                    {streak.longestStreak > streak.currentStreak && (
                                                        <> &middot; Best: {streak.longestStreak} days</>
                                                    )}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-medium text-sm">
                                                    {streak?.lastEntryDate
                                                        ? 'Restart your streak'
                                                        : 'Start journaling'
                                                    }
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {streak?.lastEntryDate
                                                        ? `Last entry ${new Date(streak.lastEntryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — write today to restart!`
                                                        : 'Write daily to build your streak!'
                                                    }
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )}
            </div>

            {/* Your Havens */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                        Your Havens
                    </h2>
                    <Button variant="ghost" size="sm" className="text-xs text-primary h-auto py-1" asChild>
                        <Link href="/havens/new">
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            New
                        </Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-32 rounded-lg" />
                        ))}
                    </div>
                ) : havens.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center">
                            <p className="text-muted-foreground mb-4">
                                You haven&apos;t created any havens yet.
                            </p>
                            <Button asChild>
                                <Link href="/havens/new">Create your first haven</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {havens.map((haven) => (
                            <Link key={haven.id} href={`/havens/${haven.id}`}>
                                <Card className="h-full hover:border-primary/40 transition-colors">
                                    {haven.coverImageUrl && (
                                        <div className="h-20 overflow-hidden rounded-t-lg bg-muted">
                                            <img
                                                src={haven.coverImageUrl}
                                                alt={haven.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <CardContent className="py-3">
                                        <p className="font-semibold text-sm">{haven.name}</p>
                                        {haven.description && (
                                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                {haven.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Images className="h-3 w-3" />
                                                {haven.contentCount ?? 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                {haven.memberCount ?? 0}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions FAB */}
            <div className="fixed bottom-6 right-6 z-50">
                {showQuickActions && (
                    <div className="mb-3 flex flex-col gap-2 animate-in slide-in-from-bottom-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="shadow-lg rounded-full px-4"
                            onClick={() => {
                                if (havens.length > 0) {
                                    router.push(`/havens/${havens[0].id}/content/upload`);
                                }
                                setShowQuickActions(false);
                            }}
                            disabled={havens.length === 0}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="group shadow-lg rounded-full px-4"
                            onClick={() => {
                                router.push('/havens/new');
                                setShowQuickActions(false);
                            }}
                        >
                            <Plus className="h-4 w-4 mr-2 transition-transform duration-300 ease-in-out group-hover:rotate-90" />
                            New Haven
                        </Button>
                    </div>
                )}
                <Button
                    size="lg"
                    className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
                    onClick={() => setShowQuickActions((v) => !v)}
                >
                    <Plus
                        className={cn(
                            'h-6 w-6 transition-transform',
                            showQuickActions && 'rotate-45'
                        )}
                    />
                </Button>
            </div>
        </div>
    );
}
