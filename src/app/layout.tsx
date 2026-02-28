import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

const inter = Inter({
    variable: '--font-sans-var',
    subsets: ['latin'],
    display: 'swap',
});

const playfair = Playfair_Display({
    variable: '--font-display-var',
    subsets: ['latin'],
    display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
    variable: '--font-mono-var',
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Forever — Preserve What Matters',
    description: 'A private space to gather photos, stories, and memories for the people you love.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
                    <TooltipProvider>{children}</TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
