'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Capsule } from '@/lib/types/capsule';
import { Lock, Unlock, Clock, FileEdit } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatCountdown(unlockAt: string): string {
    const diff = new Date(unlockAt).getTime() - Date.now();
    if (diff <= 0) return 'Ready to unlock';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 365) {
        const years = Math.floor(days / 365);
        return `Unlocks in ${years} year${years !== 1 ? 's' : ''}`;
    }
    if (days > 30) {
        const months = Math.floor(days / 30);
        return `Unlocks in ${months} month${months !== 1 ? 's' : ''}`;
    }
    if (days >= 1) {
        return `Unlocks in ${days} day${days !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function useCountdown(unlockAt: string | undefined): string {
    const [text, setText] = useState(() => unlockAt ? formatCountdown(unlockAt) : '');

    useEffect(() => {
        if (!unlockAt) return;
        setText(formatCountdown(unlockAt));

        const diff = new Date(unlockAt).getTime() - Date.now();
        if (diff <= 0 || diff > 24 * 60 * 60 * 1000) return;

        const id = setInterval(() => {
            const remaining = new Date(unlockAt).getTime() - Date.now();
            if (remaining <= 0) {
                setText('Ready to unlock');
                clearInterval(id);
            } else {
                setText(formatCountdown(unlockAt));
            }
        }, 1000);
        return () => clearInterval(id);
    }, [unlockAt]);

    return text;
}

const statusConfig = {
    draft: { icon: FileEdit, label: 'Draft', variant: 'outline' as const, cardClass: 'border-dashed' },
    locked: { icon: Lock, label: 'Locked', variant: 'secondary' as const, cardClass: 'border-primary/20' },
    unlocked: { icon: Unlock, label: 'Unlocked', variant: 'default' as const, cardClass: 'border-primary/40 bg-primary/5' },
};

export function CapsuleCard({ capsule, havenId }: { capsule: Capsule; havenId: string }) {
    const config = statusConfig[capsule.status as keyof typeof statusConfig] || statusConfig.draft;
    const StatusIcon = config.icon;
    const countdown = useCountdown(capsule.status === 'locked' ? capsule.unlockAt : undefined);

    return (
        <Link href={`/havens/${havenId}/capsules/${capsule.id}`}>
            <Card className={cn('hover:border-primary/30 transition-colors h-full', config.cardClass)}>
                <CardContent className="py-4 space-y-3">
                    <div className="flex items-start gap-3">
                        <div className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg shrink-0',
                            capsule.status === 'unlocked' ? 'bg-primary/15' : 'bg-muted'
                        )}>
                            {capsule.emoji ? (
                                <span className="text-lg">{capsule.emoji}</span>
                            ) : (
                                <StatusIcon className={cn('h-5 w-5', capsule.status === 'unlocked' ? 'text-primary' : 'text-muted-foreground')} />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{capsule.title}</p>
                            {capsule.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{capsule.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Badge variant={config.variant} className={cn('text-xs', capsule.status === 'unlocked' && 'bg-primary text-primary-foreground')}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {config.label}
                        </Badge>
                        {capsule.status === 'locked' && capsule.unlockAt && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {countdown}
                            </span>
                        )}
                        {capsule.status === 'locked' && capsule.lifeEvent && (
                            <span className="text-xs text-muted-foreground capitalize">
                                {capsule.lifeEvent.replace(/_/g, ' ')}
                            </span>
                        )}
                    </div>

                    {capsule.status === 'locked' && capsule.unlockAt && (
                        <div className="rounded-md bg-primary/10 px-3 py-1.5 text-center">
                            <span className="text-xs font-medium text-primary">
                                {countdown}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
