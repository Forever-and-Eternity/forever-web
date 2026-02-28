import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
    return (
        <section className="flex flex-col items-center justify-center px-4 py-24 text-center animate-fade-in">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                Preserve What Matters
                <span className="block text-primary">Forever</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '150ms' }}>
                A private space to gather photos, stories, and memories for the people you love. Create havens, tag loved ones, and build a
                legacy that lasts.
            </p>
            <div className="mt-8 flex gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <Link href="/register">
                    <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/login">
                    <Button size="lg" variant="outline">
                        Sign In
                    </Button>
                </Link>
            </div>
        </section>
    );
}
