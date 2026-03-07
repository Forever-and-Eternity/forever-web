'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { capsulesApi } from '@/lib/api/capsules';
import type { Capsule } from '@/lib/types/capsule';
import { ArrowLeft, Lock, Unlock, Trash2, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function CapsuleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const havenId = params.havenId as string;
    const capsuleId = params.capsuleId as string;
    const [capsule, setCapsule] = useState<Capsule | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        capsulesApi
            .get(havenId, capsuleId)
            .then(({ data: res }) => {
                if (res.success && res.data) setCapsule(res.data);
            })
            .finally(() => setLoading(false));
    }, [havenId, capsuleId]);

    const handleUnlock = async () => {
        try {
            await capsulesApi.unlock(havenId, capsuleId);
            toast.success('Capsule unlocked!');
            setCapsule((prev) => prev ? { ...prev, status: 'unlocked', unlockedAt: new Date().toISOString() } : prev);
        } catch {
            toast.error('Failed to unlock capsule');
        }
    };

    const handleDelete = async () => {
        try {
            await capsulesApi.delete(havenId, capsuleId);
            toast.success('Capsule deleted');
            router.push(`/havens/${havenId}/capsules`);
        } catch {
            toast.error('Failed to delete capsule');
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 rounded-lg" />
            </div>
        );
    }

    if (!capsule) {
        return <div className="text-center py-12 text-muted-foreground">Capsule not found.</div>;
    }

    const isLocked = capsule.status === 'locked';
    const isUnlocked = capsule.status === 'unlocked';
    const isDraft = capsule.status === 'draft';
    const dateExpired = isLocked && capsule.triggerType === 'date' && capsule.unlockAt && new Date(capsule.unlockAt).getTime() <= Date.now();
    const canManualUnlock = isLocked && (capsule.triggerType === 'event' || capsule.triggerType === 'custom' || dateExpired);

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1" />
                {isDraft && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete capsule?</AlertDialogTitle>
                                <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            <Card className={cn(
                isLocked && 'border-primary/20',
                isUnlocked && 'border-primary/40 bg-primary/5',
            )}>
                <CardContent className="py-6 space-y-4">
                    {isUnlocked && (
                        <div className="rounded-lg bg-gradient-ig p-3 text-center">
                            <p className="text-sm font-bold text-white">This capsule has been unlocked!</p>
                        </div>
                    )}
                    <div className="flex items-start gap-3">
                        {capsule.emoji && <span className="text-3xl">{capsule.emoji}</span>}
                        <div className="flex-1">
                            <h1 className="text-xl font-bold">{capsule.title}</h1>
                            {capsule.description && (
                                <p className="text-sm text-muted-foreground mt-1">{capsule.description}</p>
                            )}
                        </div>
                        <Badge variant={isLocked ? 'secondary' : isDraft ? 'outline' : 'default'} className={cn('capitalize shrink-0', isUnlocked && 'bg-primary text-primary-foreground')}>
                            {isLocked ? <Lock className="h-3 w-3 mr-1" /> : isDraft ? null : <Unlock className="h-3 w-3 mr-1" />}
                            {capsule.status}
                        </Badge>
                    </div>

                    {/* Trigger info */}
                    <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary">Lock Condition</p>
                        <div className="flex items-center gap-2 text-sm">
                            {capsule.triggerType === 'date' && (
                                <>
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>{capsule.unlockAt ? (() => {
                                        const d = new Date(capsule.unlockAt);
                                        const date = d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                                        const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                                        return `${date} @ ${time}`;
                                    })() : 'No date set'}</span>
                                </>
                            )}
                            {capsule.triggerType === 'event' && (
                                <>
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <span className="capitalize">{capsule.lifeEvent?.replace(/_/g, ' ') || 'Life event'}</span>
                                </>
                            )}
                            {capsule.triggerType === 'custom' && (
                                <>
                                    <Lock className="h-4 w-4 text-primary" />
                                    <span>{capsule.customEvent || 'Custom event'}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {capsule.unlockedAt && (
                        <p className="text-xs text-muted-foreground">
                            Unlocked on {(() => {
                                const d = new Date(capsule.unlockedAt);
                                const date = d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                                const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                                return `${date} @ ${time}`;
                            })()}
                        </p>
                    )}

                    {capsule.creatorDisplayName && (
                        <p className="text-xs text-muted-foreground">Created by {capsule.creatorDisplayName}</p>
                    )}

                    {/* Content area - placeholder for now */}
                    {capsule.status === 'unlocked' && capsule.contentIds.length > 0 && (
                        <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
                            {capsule.contentIds.length} content item{capsule.contentIds.length !== 1 ? 's' : ''} attached
                        </div>
                    )}

                    {isLocked && capsule.contentIds.length > 0 && (
                        <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground bg-muted/30">
                            <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground/50" />
                            Content hidden until unlocked
                        </div>
                    )}

                    {/* Unlock button for manual triggers */}
                    {canManualUnlock && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="w-full">
                                    <Unlock className="h-4 w-4 mr-2" />
                                    Unlock Capsule
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Unlock this capsule?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Once unlocked, this capsule cannot be locked again.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleUnlock}>Unlock</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
