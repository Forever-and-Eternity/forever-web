'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useUiStore } from '@/lib/stores/ui-store';
import { useHavenStore } from '@/lib/stores/haven-store';

export function Header() {
    const toggleSidebar = useUiStore((s) => s.toggleSidebar);
    const currentHaven = useHavenStore((s) => s.currentHaven);

    return (
        <header className="flex h-14 items-center gap-4 border-b px-4">
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="md:hidden">
                Menu
            </Button>
            <h1 className="flex-1 text-lg font-semibold">{currentHaven?.name || 'Forever'}</h1>
            <ThemeToggle />
        </header>
    );
}
