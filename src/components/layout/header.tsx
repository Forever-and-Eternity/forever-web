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

    if (!pathname.startsWith('/havens')) return crumbs;

    crumbs.push({ label: 'Havens', href: '/havens' });

    const segments = pathname.split('/').filter(Boolean);
    // segments: ["havens", havenId?, section?, subId?]

    if (segments.length < 2) return crumbs;

    const havenId = segments[1];
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
        <header className="flex h-14 items-center gap-4 border-b px-4">
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="md:hidden">
                Menu
            </Button>
            <nav className="flex flex-1 items-center gap-1 text-sm min-w-0">
                {crumbs.length === 0 ? (
                    <span className="text-lg font-semibold">Forever</span>
                ) : (
                    crumbs.map((crumb, i) => {
                        const isLast = i === crumbs.length - 1;
                        return (
                            <span key={crumb.href} className="flex items-center gap-1 min-w-0">
                                {i > 0 && <span className="text-muted-foreground mx-1">/</span>}
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
