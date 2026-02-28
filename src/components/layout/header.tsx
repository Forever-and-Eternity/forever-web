'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useUiStore } from '@/lib/stores/ui-store';
import { useHavenStore } from '@/lib/stores/haven-store';

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

    return crumbs;
}

export function Header() {
    const toggleSidebar = useUiStore((s) => s.toggleSidebar);
    const crumbs = useBreadcrumbs();

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-card/50 backdrop-blur-sm px-4">
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
            <nav className="flex flex-1 items-center gap-1 text-sm min-w-0">
                {crumbs.length === 0 ? (
                    <span className="text-lg font-bold text-gradient-ig" style={{ fontFamily: 'var(--font-display-var), serif' }}>Forever</span>
                ) : (
                    crumbs.map((crumb, i) => {
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
                    })
                )}
            </nav>
            <ThemeToggle />
        </header>
    );
}
