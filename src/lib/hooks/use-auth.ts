'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';

export function useAuth(requireAuth = true) {
    const router = useRouter();
    const { isAuthenticated, hydrate } = useAuthStore();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        if (requireAuth && !isAuthenticated) {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/login');
            }
        }
    }, [requireAuth, isAuthenticated, router]);

    return useAuthStore();
}
