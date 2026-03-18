'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useUiStore } from '@/lib/stores/ui-store';
import { authApi } from '@/lib/api/auth';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { SplashScreen } from '@/components/layout/splash-screen';

function applyAppearancePreferences(palette?: string, font?: string) {
    const root = document.documentElement;
    root.setAttribute('data-palette', palette || 'lavender');
    root.setAttribute('data-font', font || 'sora');
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { setTheme } = useTheme();
    const { hydrate, isAuthenticated, user, setUser } = useAuthStore();
    const sidebarOpen = useUiStore((s) => s.sidebarOpen);
    const [ready, setReady] = useState(false);
    const [splashDone, setSplashDone] = useState(false);

    useEffect(() => {
        // Skip splash if we've already shown it this session
        if (sessionStorage.getItem('forever-splash-shown')) {
            setSplashDone(true);
        }
    }, []);

    useEffect(() => {
        hydrate();
        setReady(true);
    }, [hydrate]);

    // Fetch preferences from the API so they persist across browsers
    useEffect(() => {
        if (ready && isAuthenticated) {
            authApi.getPreferences().then(({ data: res }) => {
                if (res.success && res.data) {
                    applyAppearancePreferences(res.data.colorPalette, res.data.fontFamily);
                    setTheme(res.data.theme || 'system');
                    if (user) {
                        setUser({ ...user, preferences: res.data });
                    }
                }
            }).catch(() => {});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, isAuthenticated]);

    // Also apply immediately from cached user for fast paint
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
        <>
        {!splashDone && (
            <SplashScreen onComplete={() => {
                setSplashDone(true);
                sessionStorage.setItem('forever-splash-shown', '1');
            }} />
        )}
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
        </>
    );
}
