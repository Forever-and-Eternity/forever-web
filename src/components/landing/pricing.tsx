'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const tiers = [
    {
        name: 'Free',
        monthlyPrice: 0,
        yearlyPrice: 0,
        storage: '500 MB',
        cta: 'Get Started',
        ctaHref: '/register',
        ctaVariant: 'outline' as const,
        highlighted: false,
        features: [
            '1 haven',
            'Up to 3 members',
            'Photo & video uploads',
            'Annotations & tags',
            'Activity feed',
            '500 MB storage',
        ],
    },
    {
        name: 'Family',
        monthlyPrice: 9.99,
        yearlyPrice: 99,
        storage: '50 GB',
        cta: 'Join Waitlist',
        ctaHref: '/register',
        ctaVariant: 'default' as const,
        highlighted: true,
        features: [
            'Unlimited havens',
            'Up to 10 members per haven',
            'Time capsules',
            'Life journals & lessons',
            'Health vault',
            '50 GB storage',
            'Priority support',
        ],
    },
    {
        name: 'Legacy',
        monthlyPrice: 19.99,
        yearlyPrice: 199,
        storage: '500 GB',
        cta: 'Join Waitlist',
        ctaHref: '/register',
        ctaVariant: 'outline' as const,
        highlighted: false,
        features: [
            'Everything in Family',
            'Unlimited members',
            'Secure keychain',
            'Encrypted family vault',
            '500 GB storage',
            'Dedicated support',
            'Early access to new features',
        ],
    },
];

export function Pricing() {
    const [annual, setAnnual] = useState(true);

    return (
        <section id="pricing" className="px-4 py-24">
            <div className="mx-auto max-w-6xl">
                <h2
                    className="mb-4 text-center text-3xl font-bold"
                    style={{ fontFamily: 'var(--font-display-var), sans-serif' }}
                >
                    Simple, family-friendly pricing
                </h2>
                <p className="mb-8 text-center text-muted-foreground max-w-xl mx-auto">
                    Start free. Upgrade when your family&apos;s collection grows.
                </p>

                {/* Annual/Monthly toggle */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    <span className={`text-sm ${!annual ? 'font-semibold' : 'text-muted-foreground'}`}>Monthly</span>
                    <button
                        onClick={() => setAnnual(!annual)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${annual ? 'bg-gradient-ig' : 'bg-muted'}`}
                        aria-label="Toggle annual billing"
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${annual ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                    <span className={`text-sm ${annual ? 'font-semibold' : 'text-muted-foreground'}`}>
                        Annual <span className="text-xs text-green-600 font-medium">(Save ~17%)</span>
                    </span>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {tiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={`relative flex flex-col ${tier.highlighted ? 'border-2 border-primary shadow-lg scale-[1.02]' : ''}`}
                        >
                            {tier.highlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-ig px-4 py-1 text-xs font-semibold text-white">
                                    Most Popular
                                </div>
                            )}
                            <CardHeader className="text-center">
                                <CardTitle className="text-xl">{tier.name}</CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">
                                        ${annual ? (tier.yearlyPrice === 0 ? '0' : tier.yearlyPrice) : (tier.monthlyPrice === 0 ? '0' : tier.monthlyPrice)}
                                    </span>
                                    {tier.monthlyPrice > 0 && (
                                        <span className="text-muted-foreground text-sm">/{annual ? 'year' : 'month'}</span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{tier.storage} storage</p>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                <ul className="space-y-3 mb-8 flex-1">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={tier.ctaHref} className="w-full">
                                    <Button
                                        variant={tier.ctaVariant}
                                        className={`w-full ${tier.highlighted ? 'bg-gradient-ig text-white hover:opacity-90' : ''}`}
                                    >
                                        {tier.cta}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
