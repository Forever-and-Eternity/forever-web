'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { havensApi } from '@/lib/api/havens';
import { useHavenStore } from '@/lib/stores/haven-store';
import { HavenNav } from '@/components/layout/haven-nav';

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
        <div className="-m-4 sm:-m-6 flex flex-col h-[calc(100%+2rem)] sm:h-[calc(100%+3rem)]">
            <HavenNav />
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
        </div>
    );
}
