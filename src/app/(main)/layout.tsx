'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useUiStore } from '@/lib/stores/ui-store';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { hydrate, isAuthenticated } = useAuthStore();
    const sidebarOpen = useUiStore((s) => s.sidebarOpen);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        hydrate();
        setReady(true);
    }, [hydrate]);

    useEffect(() => {
        if (ready && !isAuthenticated) {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/login');
            }
        }
    }, [ready, isAuthenticated, router]);

    if (!ready) {
        return null;
    }

    return (
        <div className="flex h-screen">
            <div className={cn('hidden md:block', !sidebarOpen && 'md:hidden')}>
                <Sidebar />
            </div>
            <MobileNav />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
            <Toaster />
        </div>
    );
}
