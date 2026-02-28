'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { havensApi } from '@/lib/api/havens';
import { useHavenStore } from '@/lib/stores/haven-store';

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

    return <>{children}</>;
}
