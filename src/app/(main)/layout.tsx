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

function applyAppearancePreferences(palette?: string, font?: string) {
    const root = document.documentElement;
    root.setAttribute('data-palette', palette || 'lavender');
    root.setAttribute('data-font', font || 'nunito');
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { hydrate, isAuthenticated, user } = useAuthStore();
    const sidebarOpen = useUiStore((s) => s.sidebarOpen);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        hydrate();
        setReady(true);
    }, [hydrate]);

    // Apply stored palette + font preferences on hydration
    useEffect(() => {
        if (ready && user?.preferences) {
            applyAppearancePreferences(
                user.preferences.colorPalette,
                user.preferences.fontFamily,
            );
        }
    }, [ready, user?.preferences?.colorPalette, user?.preferences?.fontFamily]);

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
        <div className="flex h-dvh">
            <div className={cn('hidden md:block', !sidebarOpen && 'md:hidden')}>
                <Sidebar />
            </div>
            <MobileNav />
            <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
            </div>
            <Toaster />
        </div>
    );
}
