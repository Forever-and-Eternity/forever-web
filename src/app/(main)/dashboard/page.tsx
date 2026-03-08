'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/stores/auth-store';
import { havensApi } from '@/lib/api/havens';
import { cn } from '@/lib/utils';
import type { Haven } from '@/lib/types/haven';
import {
    Plus,
    Upload,
    CalendarDays,
    Package,
    Flame,
    Images,
    Users,
    ChevronRight,
    Lock,
} from 'lucide-react';

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

export default function DashboardPage() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const [havens, setHavens] = useState<Haven[]>([]);
    const [loading, setLoading] = useState(true);
    const [showQuickActions, setShowQuickActions] = useState(false);

    useEffect(() => {
        havensApi
            .list(1, 50)
            .then(({ data: res }) => {
                if (res.success && res.data) {
                    setHavens(res.data.items);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Welcome Header — matches reference: avatar + greeting + bell */}
            <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 ring-2 ring-primary/30">
                    {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName} />}
                    <AvatarFallback className="text-sm font-bold bg-gradient-ig text-white">
                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {getGreeting()}
                    </p>
                    <h1
                        className="text-xl font-bold truncate"
                        style={{ fontFamily: 'var(--font-display-var), sans-serif' }}
                    >
                        {user?.displayName?.split(' ')[0] || 'there'}
                    </h1>
                </div>
            </div>

            {/* On This Day — prominent card like reference */}
            <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    On This Day
                </h2>
                <Card className="py-0 overflow-hidden">
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
                </Card>
            </div>

            {/* Upcoming Capsules — horizontal scroll like reference */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                        Upcoming Capsules
                    </h2>
                    <span className="text-xs text-primary font-medium">View All</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                    {/* Placeholder capsule cards */}
                    <Card className="min-w-[200px] sm:min-w-[220px] flex-shrink-0 snap-start border-primary/20">
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
                </div>
            </div>

            {/* Diary Streak */}
            <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    Diary Streak
                </h2>
                <Card className="border-primary/20">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Flame className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm">Start Journaling</p>
                                <p className="text-xs text-muted-foreground">
                                    Write daily to build your streak!
                                </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
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
                            <Link key={haven.id} href={`/havens/${haven.id}/content`}>
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
