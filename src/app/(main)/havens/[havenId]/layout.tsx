'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { havensApi } from '@/lib/api/havens';
import { useHavenStore } from '@/lib/stores/haven-store';
import { HavenNav } from '@/components/layout/haven-nav';
import { HavenMobileNav } from '@/components/layout/haven-mobile-nav';

export default function HavenLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const havenId = params.havenId as string;
    const { currentHaven, setCurrentHaven } = useHavenStore();

    useEffect(() => {
        if (!currentHaven || currentHaven.id !== havenId) {
            havensApi.get(havenId).then(({ data: res }) => {
                if (res.success && res.data) {
                    setCurrentHaven(res.data);
                }
            });
        }

        return () => setCurrentHaven(null);
    }, [havenId]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 -mb-4 sm:-mb-6 flex flex-col min-h-[calc(100%+2rem)] sm:min-h-[calc(100%+3rem)]">
            <div className="shrink-0">
                <HavenNav />
            </div>
            <div className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">{children}</div>
            <HavenMobileNav />
        </div>
    );
}
