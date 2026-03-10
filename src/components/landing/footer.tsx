import Link from 'next/link';
import { Heart } from 'lucide-react';

const footerLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
];

export function Footer() {
    return (
        <footer className="border-t px-4 py-12">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-ig flex items-center justify-center">
                            <Heart className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-display-var), sans-serif' }}>
                            Forever
                        </span>
                    </div>
                    <nav className="flex flex-wrap items-center justify-center gap-6">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Forever. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
