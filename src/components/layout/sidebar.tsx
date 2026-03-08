'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useHavenStore } from '@/lib/stores/haven-store';
import { havensApi } from '@/lib/api/havens';
import { cn } from '@/lib/utils';

const MIN_WIDTH = 200;
const MAX_WIDTH = 400;
const DEFAULT_WIDTH = 260;

export function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const { havens, setHavens } = useHavenStore();
    const [loaded, setLoaded] = useState(false);
    const [width, setWidth] = useState(DEFAULT_WIDTH);
    const isResizing = useRef(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('sidebar-width');
        if (saved) {
            const w = parseInt(saved, 10);
            if (w >= MIN_WIDTH && w <= MAX_WIDTH) {
                setWidth(w);
            }
        }
    }, []);

    useEffect(() => {
        if (!loaded) {
            havensApi
                .list(1, 100)
                .then(({ data: res }) => {
                    if (res.success && res.data) {
                        setHavens(res.data.items);
                    }
                })
                .finally(() => setLoaded(true));
        }
    }, [loaded, setHavens]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isResizing.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing.current) return;
            const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX));
            setWidth(newWidth);
        };

        const handleMouseUp = () => {
            isResizing.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            // Persist width
            if (sidebarRef.current) {
                localStorage.setItem('sidebar-width', String(sidebarRef.current.offsetWidth));
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    function handleLogout() {
        logout();
        window.location.href = '/login';
    }

    return (
        <div ref={sidebarRef} className="relative flex h-full flex-col border-r bg-sidebar" style={{ width }}>
            {/* Logo */}
            <div className="flex h-14 items-center px-4">
                <Link href="/dashboard" className="text-xl font-bold tracking-tight text-gradient-ig" style={{ fontFamily: 'var(--font-display-var), sans-serif' }}>
                    Forever
                </Link>
            </div>
            <Separator />

            {/* Havens list */}
            <ScrollArea className="flex-1 px-3 py-3">
                <div className="space-y-1">
                    <p className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Havens</p>
                    {havens.map((haven) => (
                        <Link
                            key={haven.id}
                            href={`/havens/${haven.id}`}
                            onClick={onNavigate}
                            className={cn(
                                'flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-accent',
                                pathname.startsWith(`/havens/${haven.id}`) && 'bg-accent font-medium text-foreground',
                            )}
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-ig text-[11px] font-bold text-white shrink-0">
                                {haven.name.charAt(0).toUpperCase()}
                            </span>
                            <span className="truncate">{haven.name}</span>
                        </Link>
                    ))}
                    <Link
                        href="/havens/new"
                        onClick={onNavigate}
                        className="group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 text-[14px] shrink-0 transition-transform duration-300 ease-in-out group-hover:rotate-90">
                            +
                        </span>
                        <span>New Haven</span>
                    </Link>
                </div>
            </ScrollArea>

            {/* Settings */}
            <Separator />
            <div className="px-3 py-2">
                <Link
                    href="/settings"
                    onClick={onNavigate}
                    className={cn(
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-accent',
                        pathname === '/settings' && 'bg-accent font-medium',
                    )}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                    Settings
                </Link>
            </div>

            {/* User profile */}
            <Separator />
            <div className="flex items-center gap-2.5 p-3">
                <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                    {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName} />}
                    <AvatarFallback className="text-xs font-semibold bg-gradient-ig text-white">
                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{user?.displayName}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={handleLogout} className="shrink-0" title="Sign out">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                </Button>
            </div>

            {/* Resize handle */}
            <div className="sidebar-resize-handle" onMouseDown={handleMouseDown} />
        </div>
    );
}
