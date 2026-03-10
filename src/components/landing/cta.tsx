import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye } from 'lucide-react';

const badges = [
    { icon: Shield, label: 'End-to-end encryption' },
    { icon: Lock, label: 'Private by default' },
    { icon: Eye, label: 'You own your data' },
];

export function CTA() {
    return (
        <section className="px-4 py-24 bg-muted/30">
            <div className="mx-auto max-w-3xl text-center">
                <h2
                    className="text-3xl sm:text-4xl font-bold mb-4"
                    style={{ fontFamily: 'var(--font-display-var), sans-serif' }}
                >
                    Start preserving your family&apos;s{' '}
                    <span className="text-gradient-ig">legacy today</span>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                    Every photo has a story. Every moment has meaning. Don&apos;t let them fade — give them a home that lasts forever.
                </p>
                <Link href="/register">
                    <Button size="lg" className="bg-gradient-ig text-white hover:opacity-90 px-10 font-semibold shadow-lg text-base">
                        Create Your Free Haven
                    </Button>
                </Link>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                    {badges.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
