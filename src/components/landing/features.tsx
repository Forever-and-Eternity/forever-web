import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { House, MessageSquareText, Users, Clock, BookOpen, Lightbulb, HeartPulse, KeyRound } from 'lucide-react';

const features = [
    {
        title: 'Private Havens',
        description: 'Create dedicated spaces for different groups — family, friends, or just for yourself. Complete privacy by default.',
        icon: House,
    },
    {
        title: 'Rich Annotations',
        description: 'Add stories, dates, locations, and lessons learned to every photo and document you upload.',
        icon: MessageSquareText,
    },
    {
        title: 'Tag & Connect',
        description: 'Tag people in your content and invite them to see their own memories across your havens.',
        icon: Users,
    },
    {
        title: 'Time Capsules',
        description: 'Lock messages, photos, and videos to be delivered at future dates or life milestones.',
        icon: Clock,
    },
    {
        title: 'Life Journals',
        description: 'Keep a private diary with mood tracking, tags, and attached photos. Build a streak of daily reflection.',
        icon: BookOpen,
    },
    {
        title: 'Life Lessons',
        description: 'Record wisdom and advice organized by life stage — from parenting tips to financial insights.',
        icon: Lightbulb,
    },
    {
        title: 'Health Vault',
        description: 'Track medical conditions, medications, allergies, and providers with an interactive body map.',
        icon: HeartPulse,
    },
    {
        title: 'Secure Keychain',
        description: 'Store passwords, bank details, and legal documents with AES-256 encryption for your family.',
        icon: KeyRound,
    },
];

export function Features() {
    return (
        <section id="features" className="bg-muted/30 px-4 py-24">
            <div className="mx-auto max-w-6xl">
                <h2 className="mb-4 text-center text-3xl font-bold" style={{ fontFamily: 'var(--font-display-var), sans-serif' }}>
                    Everything you need to preserve memories
                </h2>
                <p className="mb-12 text-center text-muted-foreground max-w-2xl mx-auto">
                    Built with care for the moments that matter most. From photos to passwords, from journals to time capsules.
                </p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-stagger">
                    {features.map((feature) => (
                        <Card key={feature.title} className="group hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-ig text-white">
                                    <feature.icon className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
