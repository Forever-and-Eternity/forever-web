'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 4,
    delay: Math.random() * 3,
}));

export default function NotFound() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
            {/* Floating particles */}
            {PARTICLES.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-primary/20"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        animation: mounted
                            ? `float ${p.duration}s ease-in-out ${p.delay}s infinite`
                            : 'none',
                    }}
                />
            ))}

            {/* Gradient orbs */}
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[oklch(0.7_0.15_290/0.08)] blur-[100px] animate-gradient" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[oklch(0.7_0.15_330/0.06)] blur-[80px] animate-gradient" style={{ animationDelay: '2s' }} />

            <div
                className="relative flex flex-col items-center gap-6 text-center"
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {/* Animated 404 number */}
                <div className="relative">
                    <h1
                        className="text-[10rem] sm:text-[14rem] font-bold leading-none tracking-tighter text-gradient-ig select-none"
                        style={{
                            fontFamily: 'var(--font-display-var), sans-serif',
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'scale(1)' : 'scale(0.8)',
                            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                        }}
                    >
                        4
                        <span className="inline-block" style={{ animation: mounted ? 'float 3s ease-in-out infinite' : 'none' }}>
                            <Heart className="inline h-24 w-24 sm:h-32 sm:w-32 -mt-4" />
                        </span>
                        4
                    </h1>
                </div>

                {/* Message */}
                <div
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.6s ease 0.5s',
                    }}
                >
                    <h2
                        className="text-2xl font-semibold text-foreground mb-2"
                        style={{ fontFamily: 'var(--font-display-var), sans-serif' }}
                    >
                        Lost in the memories
                    </h2>
                    <p className="text-muted-foreground max-w-md text-balance">
                        This page doesn&apos;t exist — but your memories always will.
                        Let&apos;s get you back to where they live.
                    </p>
                </div>

                {/* Action buttons */}
                <div
                    className="flex flex-col sm:flex-row items-center gap-3 mt-4"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.6s ease 0.7s',
                    }}
                >
                    <Button asChild size="lg" className="bg-gradient-ig text-white hover:opacity-90 btn-glisten">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" onClick={() => history.back()}>
                        <button type="button" onClick={() => history.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go back
                        </button>
                    </Button>
                </div>
            </div>
        </div>
    );
}
