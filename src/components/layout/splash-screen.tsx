'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState<'enter' | 'pulse' | 'exit'>('enter');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('pulse'), 400);
        const t2 = setTimeout(() => setPhase('exit'), 1600);
        const t3 = setTimeout(onComplete, 2200);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onComplete]);

    return (
        <div
            className={cn(
                'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500',
                phase === 'exit' && 'opacity-0 pointer-events-none',
            )}
        >
            {/* Animated gradient orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className={cn(
                        'absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] transition-all duration-1000',
                        'bg-[oklch(0.7_0.15_290/0.15)]',
                        phase === 'enter' && 'scale-50 opacity-0',
                        phase === 'pulse' && 'scale-100 opacity-100',
                        phase === 'exit' && 'scale-150 opacity-0',
                    )}
                />
                <div
                    className={cn(
                        'absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-1000 delay-150',
                        'bg-[oklch(0.7_0.15_330/0.12)]',
                        phase === 'enter' && 'scale-50 opacity-0',
                        phase === 'pulse' && 'scale-100 opacity-100',
                        phase === 'exit' && 'scale-150 opacity-0',
                    )}
                />
            </div>

            {/* Logo */}
            <div
                className={cn(
                    'relative flex flex-col items-center gap-4 transition-all duration-700',
                    phase === 'enter' && 'scale-75 opacity-0 translate-y-4',
                    phase === 'pulse' && 'scale-100 opacity-100 translate-y-0',
                    phase === 'exit' && 'scale-110 opacity-0 -translate-y-4',
                )}
            >
                {/* Heart icon with gradient bg and ring pulse */}
                <div className="relative">
                    <div
                        className={cn(
                            'absolute inset-0 rounded-2xl bg-gradient-ig blur-xl transition-opacity duration-700',
                            phase === 'pulse' ? 'opacity-40 animate-pulse' : 'opacity-0',
                        )}
                    />
                    <div className="relative h-16 w-16 rounded-2xl bg-gradient-ig flex items-center justify-center shadow-xl">
                        <Heart className="h-8 w-8 text-white" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Brand name */}
                <h1
                    className="text-3xl font-bold tracking-tight text-gradient-ig"
                    style={{ fontFamily: 'var(--font-display-var), sans-serif' }}
                >
                    Forever
                </h1>

                {/* Tagline */}
                <p
                    className={cn(
                        'text-sm text-muted-foreground transition-all duration-500 delay-300',
                        phase === 'pulse' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
                    )}
                >
                    Preserve what matters
                </p>

                {/* Loading dots */}
                <div className="flex gap-1.5 mt-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-primary/50"
                            style={{
                                animation: phase === 'pulse' ? `pulse 1s ease-in-out ${i * 0.2}s infinite` : 'none',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
