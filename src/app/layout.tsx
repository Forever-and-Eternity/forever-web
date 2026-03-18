import type { Metadata } from 'next';
import {
    Nunito,
    Plus_Jakarta_Sans,
    Outfit,
    DM_Sans,
    Manrope,
    Sora,
    Space_Grotesk,
    JetBrains_Mono,
} from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DemoBanner } from '@/components/layout/demo-banner';
import './globals.css';

const nunito = Nunito({
    variable: '--font-nunito',
    subsets: ['latin'],
    display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: '--font-plus-jakarta-sans',
    subsets: ['latin'],
    display: 'swap',
});

const outfit = Outfit({
    variable: '--font-outfit',
    subsets: ['latin'],
    display: 'swap',
});

const dmSans = DM_Sans({
    variable: '--font-dm-sans',
    subsets: ['latin'],
    display: 'swap',
});

const manrope = Manrope({
    variable: '--font-manrope',
    subsets: ['latin'],
    display: 'swap',
});

const sora = Sora({
    variable: '--font-sora',
    subsets: ['latin'],
    display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
    variable: '--font-space-grotesk',
    subsets: ['latin'],
    display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
    variable: '--font-mono-var',
    subsets: ['latin'],
    display: 'swap',
});

const fontVars = [
    sora.variable,
    nunito.variable,
    plusJakartaSans.variable,
    outfit.variable,
    dmSans.variable,
    manrope.variable,
    spaceGrotesk.variable,
    jetbrainsMono.variable,
].join(' ');

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
        <html lang="en" suppressHydrationWarning className={fontVars} data-palette="lavender" data-font="sora">
            <body className="font-sans antialiased" suppressHydrationWarning>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
                    <DemoBanner />
                    <TooltipProvider>{children}</TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
