import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
    {
        title: 'Private Havens',
        description: 'Create dedicated spaces for different groups — family, friends, or just for yourself.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        ),
    },
    {
        title: 'Rich Annotations',
        description: 'Add stories, dates, locations, and lessons learned to every photo and document.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        ),
    },
    {
        title: 'Tag & Connect',
        description: 'Tag people in your content and invite them to see their own memories.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        ),
    },
    {
        title: 'Secure Sharing',
        description: 'Share via invitation links. Recipients create accounts and access only what you allow.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        ),
    },
];

export function Features() {
    return (
        <section className="bg-muted/30 px-4 py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-4 text-center text-3xl font-bold" style={{ fontFamily: 'var(--font-display-var), serif' }}>
                    Everything you need to preserve memories
                </h2>
                <p className="mb-12 text-center text-muted-foreground max-w-2xl mx-auto">
                    Built with care for the moments that matter most
                </p>
                <div className="grid gap-6 sm:grid-cols-2 animate-stagger">
                    {features.map((feature) => (
                        <Card key={feature.title} className="group hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-ig text-white">
                                    {feature.icon}
                                </div>
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
