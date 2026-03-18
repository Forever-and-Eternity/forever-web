'use client';

import { useState } from 'react';
import { FlaskConical, X } from 'lucide-react';

export function DemoBanner() {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    if (!isDemoMode) return null;

    return (
        <div className="relative z-50 flex items-center justify-center gap-2 bg-gradient-ig px-4 py-1.5 text-xs font-medium text-white">
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Demo Environment — data may be reset periodically</span>
            <button
                onClick={() => setDismissed(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-white/20 transition-colors"
            >
                <X className="h-3 w-3" />
            </button>
        </div>
    );
}
