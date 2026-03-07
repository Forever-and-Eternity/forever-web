import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <Link
                href="/"
                className="absolute top-4 left-4 text-xl font-bold tracking-tight text-gradient-ig"
                style={{ fontFamily: 'var(--font-display-var), sans-serif' }}
            >
                Forever
            </Link>
            {children}
        </div>
    );
}
