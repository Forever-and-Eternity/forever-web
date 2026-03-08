'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/lib/stores/ui-store';
import { useHavenStore } from '@/lib/stores/haven-store';
import { notificationsApi } from '@/lib/api/notifications';

interface Crumb {
    label: string;
    href: string;
}

function useBreadcrumbs(): Crumb[] {
    const pathname = usePathname();
    const currentHaven = useHavenStore((s) => s.currentHaven);

    const crumbs: Crumb[] = [];

    if (pathname === '/settings') {
        crumbs.push({ label: 'Settings', href: '/settings' });
        return crumbs;
    }

    if (pathname === '/dashboard') {
        crumbs.push({ label: 'Dashboard', href: '/dashboard' });
        return crumbs;
    }

    if (pathname.startsWith('/notifications')) {
        crumbs.push({ label: 'Notifications', href: '/notifications' });
        return crumbs;
    }

    if (!pathname.startsWith('/havens')) return crumbs;

    crumbs.push({ label: 'Havens', href: '/havens' });

    const segments = pathname.split('/').filter(Boolean);

    if (segments.length < 2) return crumbs;

    const havenId = segments[1];
    if (havenId === 'new') {
        crumbs.push({ label: 'New Haven', href: '/havens/new' });
        return crumbs;
    }

    const havenName = currentHaven?.id === havenId ? currentHaven.name : 'Haven';
    crumbs.push({ label: havenName, href: `/havens/${havenId}` });

    if (segments.length < 3) return crumbs;

    const section = segments[2];
    const sectionLabel = section.charAt(0).toUpperCase() + section.slice(1);
    crumbs.push({ label: sectionLabel, href: `/havens/${havenId}/${section}` });

    if (segments.length >= 4 && section === 'content' && segments[3] !== 'upload') {
        crumbs.push({ label: 'Detail', href: pathname });
    }

    if (segments.length >= 4 && section === 'people' && segments[3] === 'new') {
        crumbs.push({ label: 'New', href: pathname });
    } else if (segments.length >= 4 && section === 'people' && segments[3] !== 'new') {
        crumbs.push({ label: 'Detail', href: pathname });
    }

    if (segments.length >= 4 && section === 'content' && segments[3] === 'upload') {
        crumbs.push({ label: 'Upload', href: pathname });
    }

    if (segments.length >= 4 && section === 'journals' && segments[3] === 'new') {
        crumbs.push({ label: 'New', href: pathname });
    } else if (segments.length >= 4 && section === 'journals' && segments[3] !== 'new') {
        crumbs.push({ label: 'Entry', href: pathname });
    }

    if (segments.length >= 4 && section === 'capsules' && segments[3] === 'new') {
        crumbs.push({ label: 'New', href: pathname });
    } else if (segments.length >= 4 && section === 'capsules' && segments[3] !== 'new') {
        crumbs.push({ label: 'Detail', href: pathname });
    }

    if (segments.length >= 4 && section === 'lessons' && segments[3] === 'new') {
        crumbs.push({ label: 'New', href: pathname });
    } else if (segments.length >= 4 && section === 'lessons' && segments[3] !== 'new') {
        crumbs.push({ label: 'Detail', href: pathname });
    }

    if (segments.length >= 4 && section === 'health') {
        crumbs.push({ label: 'Detail', href: pathname });
    }

    return crumbs;
}

export function Header() {
    const toggleSidebar = useUiStore((s) => s.toggleSidebar);
    const router = useRouter();
    const crumbs = useBreadcrumbs();
    const [unreadCount, setUnreadCount] = useState(0);
    const canGoBack = crumbs.length > 1;
    const currentPage = crumbs.length > 0 ? crumbs[crumbs.length - 1] : null;

    useEffect(() => {
        notificationsApi
            .getUnreadCount()
            .then(({ data: res }) => {
                if (res.success && res.data !== undefined) {
                    setUnreadCount(res.data);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <header className="flex h-14 items-center gap-2 sm:gap-4 border-b bg-card/50 backdrop-blur-sm px-3 sm:px-4">
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="md:hidden shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
            {/* Mobile: back button + current page only */}
            {canGoBack && (
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="sm:hidden shrink-0">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            )}
            <nav className="flex flex-1 items-center gap-1 text-sm min-w-0">
                {/* Mobile: show only current page name */}
                {crumbs.length === 0 ? (
                    <span className="text-lg font-bold text-gradient-ig" style={{ fontFamily: 'var(--font-display-var), sans-serif' }}>Forever</span>
                ) : (
                    <>
                        {/* Mobile: current page only */}
                        <span className="sm:hidden font-semibold truncate">{currentPage?.label}</span>
                        {/* Desktop: full breadcrumb */}
                        <span className="hidden sm:flex items-center gap-1">
                            {crumbs.map((crumb, i) => {
                                const isLast = i === crumbs.length - 1;
                                return (
                                    <span key={crumb.href} className="flex items-center gap-1 min-w-0">
                                        {i > 0 && <span className="text-muted-foreground/50 mx-1">/</span>}
                                        {isLast ? (
                                            <span className="font-semibold truncate">{crumb.label}</span>
                                        ) : (
                                            <Link
                                                href={crumb.href}
                                                className="text-muted-foreground hover:text-foreground transition-colors truncate"
                                            >
                                                {crumb.label}
                                            </Link>
                                        )}
                                    </span>
                                );
                            })}
                        </span>
                    </>
                )}
            </nav>
            <Link href="/notifications" className="relative">
                <Button variant="ghost" size="sm">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </Link>
        </header>
    );
}
