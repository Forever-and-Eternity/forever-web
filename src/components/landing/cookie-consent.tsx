'use client';

import { useState } from 'react';
import { Cookie, Shield, BarChart3, Megaphone, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCookieConsent, type CookiePreferences } from '@/lib/hooks/use-cookie-consent';
import { cn } from '@/lib/utils';

export function CookieConsent() {
    const { showBanner, acceptAll, rejectNonEssential, savePreferences } = useCookieConsent();
    const [expanded, setExpanded] = useState(false);
    const [customPrefs, setCustomPrefs] = useState<CookiePreferences>({
        essential: true,
        analytics: false,
        marketing: false,
    });

    if (!showBanner) return null;

    return (
        <div
            className={cn(
                'fixed bottom-0 left-0 right-0 z-50',
                'animate-in slide-in-from-bottom-full duration-500 ease-out',
                'px-4 pb-4 sm:px-6 sm:pb-6',
            )}
        >
            <div
                className={cn(
                    'mx-auto max-w-2xl',
                    'rounded-2xl border bg-card/95 backdrop-blur-xl shadow-2xl',
                    'overflow-hidden transition-all duration-300',
                )}
            >
                {/* Gradient accent bar */}
                <div className="h-1 w-full bg-gradient-ig" />

                <div className="p-5 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <Cookie className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base text-foreground">
                                We value your privacy
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                We use cookies to keep you signed in and understand how you use Forever
                                so we can make it better. You choose what you&apos;re comfortable with.
                            </p>
                        </div>
                    </div>

                    {/* Expandable preferences */}
                    <div
                        className={cn(
                            'grid transition-all duration-300 ease-in-out',
                            expanded ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]',
                        )}
                    >
                        <div className="overflow-hidden">
                            <div className="space-y-3 pb-1">
                                <CookieCategory
                                    icon={<Shield className="h-4 w-4" />}
                                    title="Essential"
                                    description="Authentication, security, and core functionality. Always active."
                                    checked={true}
                                    disabled={true}
                                />
                                <CookieCategory
                                    icon={<BarChart3 className="h-4 w-4" />}
                                    title="Analytics"
                                    description="Help us understand how you use Forever to improve the experience."
                                    checked={customPrefs.analytics}
                                    onChange={(v) => setCustomPrefs((p) => ({ ...p, analytics: v }))}
                                />
                                <CookieCategory
                                    icon={<Megaphone className="h-4 w-4" />}
                                    title="Marketing"
                                    description="Allow personalised tips and feature recommendations."
                                    checked={customPrefs.marketing}
                                    onChange={(v) => setCustomPrefs((p) => ({ ...p, marketing: v }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpanded(!expanded)}
                            className="text-muted-foreground order-last sm:order-first sm:mr-auto"
                        >
                            {expanded ? (
                                <>
                                    <ChevronDown className="mr-1.5 h-3.5 w-3.5" />
                                    Less options
                                </>
                            ) : (
                                <>
                                    <ChevronUp className="mr-1.5 h-3.5 w-3.5" />
                                    Customise
                                </>
                            )}
                        </Button>

                        <div className="flex items-center gap-2">
                            {expanded ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => savePreferences(customPrefs)}
                                >
                                    Save preferences
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={rejectNonEssential}
                                >
                                    Essential only
                                </Button>
                            )}
                            <Button size="sm" onClick={acceptAll} className="btn-glisten">
                                Accept all
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CookieCategory({
    icon,
    title,
    description,
    checked,
    disabled,
    onChange,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    checked: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
            <Switch
                checked={checked}
                disabled={disabled}
                onCheckedChange={onChange}
                className="shrink-0"
            />
        </div>
    );
}
