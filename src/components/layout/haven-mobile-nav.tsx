'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    ImageIcon,
    Users,
    BookOpen,
    TimerIcon,
    GraduationCap,
    HeartPulse,
    KeyRound,
    Rss,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { label: 'Feed', segment: 'feed', icon: Rss, color: 'text-primary' },
    { label: 'Content', segment: 'content', icon: ImageIcon, color: 'text-primary' },
    { label: 'People', segment: 'people', icon: Users, color: 'text-pink-500' },
    { label: 'Journals', segment: 'journals', icon: BookOpen, color: 'text-amber-500' },
    { label: 'Capsules', segment: 'capsules', icon: TimerIcon, color: 'text-cyan-500' },
    { label: 'Lessons', segment: 'lessons', icon: GraduationCap, color: 'text-emerald-500' },
    { label: 'Health', segment: 'health', icon: HeartPulse, color: 'text-rose-500' },
    { label: 'Vault', segment: 'vault', icon: KeyRound, color: 'text-indigo-500' },
];

export function HavenMobileNav() {
    const params = useParams();
    const pathname = usePathname();
    const havenId = params.havenId as string;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm">
            <ScrollArea className="w-full">
                <div className="flex px-2 py-2 gap-1">
                    {NAV_ITEMS.map(({ label, segment, icon: Icon, color }) => {
                        const href = `/havens/${havenId}/${segment}`;
                        const isActive = pathname === href || pathname.startsWith(href + '/');

                        return (
                            <Link
                                key={segment}
                                href={href}
                                className={cn(
                                    'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors shrink-0',
                                    isActive ? 'bg-accent' : 'active:bg-accent',
                                )}
                            >
                                <Icon className={cn('size-5', isActive ? color : 'text-muted-foreground')} />
                                <span className={cn(
                                    'text-[10px] font-medium',
                                    isActive ? 'text-foreground' : 'text-muted-foreground',
                                )}>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
