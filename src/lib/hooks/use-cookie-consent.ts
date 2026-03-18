'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CookiePreferences {
    essential: boolean; // Always true, cannot be disabled
    analytics: boolean;
    marketing: boolean;
}

const STORAGE_KEY = 'forever-cookie-consent';

const DEFAULT_PREFERENCES: CookiePreferences = {
    essential: true,
    analytics: false,
    marketing: false,
};

export function useCookieConsent() {
    const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setPreferences(JSON.parse(stored));
                setShowBanner(false);
            } catch {
                setShowBanner(true);
            }
        } else {
            // Small delay so the page loads before the banner slides in
            const timer = setTimeout(() => setShowBanner(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptAll = useCallback(() => {
        const prefs: CookiePreferences = { essential: true, analytics: true, marketing: true };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
        setPreferences(prefs);
        setShowBanner(false);
    }, []);

    const rejectNonEssential = useCallback(() => {
        const prefs: CookiePreferences = { ...DEFAULT_PREFERENCES };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
        setPreferences(prefs);
        setShowBanner(false);
    }, []);

    const savePreferences = useCallback((prefs: CookiePreferences) => {
        const final = { ...prefs, essential: true }; // Essential always on
        localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
        setPreferences(final);
        setShowBanner(false);
    }, []);

    const resetConsent = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setPreferences(null);
        setShowBanner(true);
    }, []);

    return { preferences, showBanner, acceptAll, rejectNonEssential, savePreferences, resetConsent };
}
