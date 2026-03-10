import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
];

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-ig flex items-center justify-center">
                        <Heart className="h-4 w-4 text-white" />
                    </div>
                    <span
                        className="font-bold text-lg"
                        style={{ fontFamily: 'var(--font-display-var), sans-serif' }}
                    >
                        Forever
                    </span>
                </Link>

                <nav className="hidden sm:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="font-medium btn-glisten">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button size="sm" className="bg-gradient-ig text-white hover:opacity-90 font-medium btn-glisten">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
