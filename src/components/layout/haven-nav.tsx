'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Images,
    Users,
    Rss,
    UserPlus,
    BookOpen,
    Package,
    GraduationCap,
    HeartPulse,
    Lock,
} from 'lucide-react';

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

export function HavenNav() {
    const pathname = usePathname();
    const params = useParams();
    const havenId = params.havenId as string;

    const navItems: NavItem[] = [
        { label: 'Content', href: `/havens/${havenId}/content`, icon: Images },
        { label: 'People', href: `/havens/${havenId}/people`, icon: Users },
        { label: 'Feed', href: `/havens/${havenId}/feed`, icon: Rss },
        { label: 'Members', href: `/havens/${havenId}/members`, icon: UserPlus },
        { label: 'Journals', href: `/havens/${havenId}/journals`, icon: BookOpen },
        { label: 'Capsules', href: `/havens/${havenId}/capsules`, icon: Package },
        { label: 'Lessons', href: `/havens/${havenId}/lessons`, icon: GraduationCap },
        { label: 'Health', href: `/havens/${havenId}/health`, icon: HeartPulse },
        { label: 'Vault', href: `/havens/${havenId}/vault`, icon: Lock },
    ];

    return (
        <div className="border-b bg-card/50 backdrop-blur-sm">
            <ScrollArea className="w-full">
                <nav className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-4 py-1.5">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;

                        return (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'inline-flex items-center justify-center gap-1.5 rounded-md px-2.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap',
                                            isActive
                                                ? 'bg-primary/15 text-primary'
                                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                        )}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        <span className="hidden sm:inline">{item.label}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className="sm:hidden" side="bottom">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
