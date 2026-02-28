import { create } from 'zustand';
import type { Haven } from '@/lib/types/haven';

interface HavenState {
    havens: Haven[];
    currentHaven: Haven | null;
    setHavens: (havens: Haven[]) => void;
    setCurrentHaven: (haven: Haven | null) => void;
    addHaven: (haven: Haven) => void;
    updateHaven: (id: string, haven: Partial<Haven>) => void;
    removeHaven: (id: string) => void;
}

export const useHavenStore = create<HavenState>((set) => ({
    havens: [],
    currentHaven: null,

    setHavens: (havens) => set({ havens }),

    setCurrentHaven: (haven) => set({ currentHaven: haven }),

    addHaven: (haven) => set((state) => ({ havens: [haven, ...state.havens] })),

    updateHaven: (id, updates) =>
        set((state) => ({
            havens: state.havens.map((h) => (h.id === id ? { ...h, ...updates } : h)),
            currentHaven: state.currentHaven?.id === id ? { ...state.currentHaven, ...updates } : state.currentHaven,
        })),

    removeHaven: (id) =>
        set((state) => ({
            havens: state.havens.filter((h) => h.id !== id),
            currentHaven: state.currentHaven?.id === id ? null : state.currentHaven,
        })),
}));
