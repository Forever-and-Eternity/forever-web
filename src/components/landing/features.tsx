import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
    {
        title: 'Private Havens',
        description: 'Create dedicated spaces for different groups — family, friends, or just for yourself.',
    },
    {
        title: 'Rich Annotations',
        description: 'Add stories, dates, locations, and lessons learned to every photo and document.',
    },
    {
        title: 'Tag & Connect',
        description: 'Tag people in your content and invite them to see their own memories.',
    },
    {
        title: 'Secure Sharing',
        description: 'Share via invitation links. Recipients create accounts and access only what you allow.',
    },
];

export function Features() {
    return (
        <section className="bg-muted/30 px-4 py-20">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-12 text-center text-3xl font-bold">Everything you need to preserve memories</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                    {features.map((feature) => (
                        <Card key={feature.title}>
                            <CardHeader>
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
