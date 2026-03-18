'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Images,
    Users,
    Rss,
    BookOpen,
    Package,
    GraduationCap,
    HeartPulse,
    Lock,
    Settings,
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
        { label: 'Journals', href: `/havens/${havenId}/journals`, icon: BookOpen },
        { label: 'Capsules', href: `/havens/${havenId}/capsules`, icon: Package },
        { label: 'Lessons', href: `/havens/${havenId}/lessons`, icon: GraduationCap },
        { label: 'Health', href: `/havens/${havenId}/health`, icon: HeartPulse },
        { label: 'Vault', href: `/havens/${havenId}/vault`, icon: Lock },
    ];

    return (
        <div className="hidden md:block sticky top-0 z-30 border-b bg-card/80 backdrop-blur-md">
                <nav className="flex flex-nowrap items-center justify-center gap-0.5 sm:gap-1 px-2 sm:px-4 py-2.5">
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
                                            'inline-flex items-center justify-center gap-1.5 rounded-2xl px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap border-2 border-transparent',
                                            isActive
                                                ? 'border-primary/50 bg-primary/10 text-primary shadow-sm'
                                                : 'text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm'
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

                    <div className="w-px h-5 bg-border mx-1 shrink-0" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/settings"
                                className={cn(
                                    'inline-flex items-center justify-center gap-1.5 rounded-2xl px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap border-2 border-transparent',
                                    pathname === '/settings'
                                        ? 'border-primary/50 bg-primary/10 text-primary shadow-sm'
                                        : 'text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm'
                                )}
                            >
                                <Settings className="h-4 w-4 shrink-0" />
                                <span className="hidden sm:inline">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent className="sm:hidden" side="bottom">
                            Settings
                        </TooltipContent>
                    </Tooltip>
                </nav>
        </div>
    );
}
