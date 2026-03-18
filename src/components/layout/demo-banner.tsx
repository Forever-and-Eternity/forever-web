'use client';

import { useEffect, useState } from 'react';
import { FlaskConical, X } from 'lucide-react';

const STORAGE_KEY = 'forever-demo-banner-dismissed';

export function DemoBanner() {
    const [dismissed, setDismissed] = useState(true); // Start hidden to avoid flash

    useEffect(() => {
        setDismissed(localStorage.getItem(STORAGE_KEY) === 'true');
    }, []);

    if (dismissed) return null;

    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    if (!isDemoMode) return null;

    function handleDismiss() {
        localStorage.setItem(STORAGE_KEY, 'true');
        setDismissed(true);
    }

    return (
        <div className="relative z-50 flex items-center justify-center gap-2 bg-gradient-ig px-4 py-1.5 text-xs font-medium text-white">
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Demo Environment — data may be reset periodically</span>
            <button
                onClick={handleDismiss}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-white/20 transition-colors"
            >
                <X className="h-3 w-3" />
            </button>
        </div>
    );
}
