import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
    {
        name: 'Maria Rodriguez',
        role: 'Mother of three',
        quote: "Forever changed how our family preserves memories. My kids love opening time capsules I made when they were babies. It's like a digital family heirloom.",
        avatarUrl: 'https://picsum.photos/id/64/80/80',
    },
    {
        name: 'James & Priya Okafor',
        role: 'Married 12 years',
        quote: "We use Forever to keep our wedding memories, health records, and family documents all in one place. The keychain feature alone is worth it — no more sticky notes with passwords.",
        avatarUrl: 'https://picsum.photos/id/65/80/80',
    },
    {
        name: 'David Chen',
        role: 'Grandfather',
        quote: "I'm recording life lessons and stories for my grandchildren. Some are locked until they turn 18. Knowing these memories will reach them means the world to me.",
        avatarUrl: 'https://picsum.photos/id/91/80/80',
    },
];

export function Testimonials() {
    return (
        <section className="bg-muted/30 px-4 py-24">
            <div className="mx-auto max-w-6xl">
                <h2
                    className="mb-4 text-center text-3xl font-bold"
                    style={{ fontFamily: 'var(--font-display-var), sans-serif' }}
                >
                    Loved by families everywhere
                </h2>
                <p className="mb-12 text-center text-muted-foreground max-w-xl mx-auto text-sm">
                    Illustrative testimonials representing the Forever experience.
                </p>
                <div className="grid gap-6 md:grid-cols-3">
                    {testimonials.map((t) => (
                        <Card key={t.name} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={t.avatarUrl}
                                        alt=""
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{t.name}</p>
                                        <p className="text-xs text-muted-foreground">{t.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
