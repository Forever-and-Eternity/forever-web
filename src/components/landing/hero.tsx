import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
    return (
        <section className="flex flex-col items-center justify-center px-4 py-28 text-center animate-fade-in">
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl" style={{ fontFamily: 'var(--font-display-var), sans-serif' }}>
                Preserve What Matters
                <span className="block text-gradient-ig mt-2">Forever</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground animate-fade-in" style={{ animationDelay: '150ms' }}>
                A private space to gather photos, stories, and memories for the people you love. Create havens, tag loved ones, and build a
                legacy that lasts.
            </p>
            <div className="mt-10 flex gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <Link href="/register">
                    <Button size="lg" className="bg-gradient-ig text-white hover:opacity-90 px-8 font-semibold shadow-lg">
                        Get Started
                    </Button>
                </Link>
                <Link href="/login">
                    <Button size="lg" variant="outline" className="px-8 font-semibold">
                        Sign In
                    </Button>
                </Link>
            </div>
        </section>
    );
}
