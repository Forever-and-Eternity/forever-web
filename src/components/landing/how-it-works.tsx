import { Plus, Upload, Share2 } from 'lucide-react';

const steps = [
    {
        step: 1,
        title: 'Create a Haven',
        description: 'Set up a private space for your family, a trip, or a special occasion. You control who has access.',
        icon: Plus,
    },
    {
        step: 2,
        title: 'Upload & Annotate',
        description: 'Add photos, videos, and documents. Enrich them with stories, tags, dates, and the people who matter.',
        icon: Upload,
    },
    {
        step: 3,
        title: 'Share & Preserve',
        description: 'Invite family members, lock time capsules for future delivery, and build a legacy that lasts.',
        icon: Share2,
    },
];

export function HowItWorks() {
    return (
        <section className="px-4 py-24">
            <div className="mx-auto max-w-4xl">
                <h2
                    className="mb-4 text-center text-3xl font-bold"
                    style={{ fontFamily: 'var(--font-display-var), sans-serif' }}
                >
                    How it works
                </h2>
                <p className="mb-16 text-center text-muted-foreground max-w-xl mx-auto">
                    Get started in minutes. Your memories deserve more than a camera roll.
                </p>
                <div className="grid gap-12 md:grid-cols-3">
                    {steps.map(({ step, title, description, icon: Icon }) => (
                        <div key={step} className="text-center group">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-ig text-white shadow-lg transition-transform group-hover:scale-110">
                                <Icon className="h-7 w-7" />
                            </div>
                            <div className="mb-2 text-sm font-medium text-muted-foreground">Step {step}</div>
                            <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
