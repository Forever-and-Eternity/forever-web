'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useHavenStore } from '@/lib/stores/haven-store';
import { havensApi } from '@/lib/api/havens';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const { havens, setHavens } = useHavenStore();
    const [loaded, setLoaded] = useState(false);

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

    function handleLogout() {
        logout();
        window.location.href = '/login';
    }

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card">
            <div className="flex h-14 items-center px-4">
                <Link href="/havens" className="text-lg font-semibold">
                    Forever
                </Link>
            </div>
            <Separator />
            <ScrollArea className="flex-1 px-3 py-2">
                <div className="space-y-1">
                    <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">Havens</p>
                    {havens.map((haven) => (
                        <Link
                            key={haven.id}
                            href={`/havens/${haven.id}`}
                            className={cn(
                                'block rounded-md px-2 py-1.5 text-sm hover:bg-accent',
                                pathname.startsWith(`/havens/${haven.id}`) && 'bg-accent font-medium',
                            )}
                        >
                            {haven.name}
                        </Link>
                    ))}
                    <Link href="/havens/new" className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent">
                        + New Haven
                    </Link>
                </div>
            </ScrollArea>
            <Separator />
            <div className="flex items-center gap-2 p-3">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{user?.displayName}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Sign out
                </Button>
            </div>
        </div>
    );
}
