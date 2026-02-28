'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useHavenStore } from '@/lib/stores/haven-store';

export default function HavenDetailPage() {
    const params = useParams();
    const havenId = params.havenId as string;
    const haven = useHavenStore((s) => s.currentHaven);

    if (!haven || haven.id !== havenId) return <Skeleton className="h-64 rounded-lg" />;

    const links = [
        { label: 'Content', href: `/havens/${havenId}/content`, count: haven.contentCount },
        { label: 'People', href: `/havens/${havenId}/people`, count: null },
        { label: 'Feed', href: `/havens/${havenId}/feed`, count: null },
        { label: 'Members', href: `/havens/${havenId}/members`, count: haven.memberCount },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">{haven.name}</h2>
                {haven.description && <p className="mt-1 text-muted-foreground">{haven.description}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-stagger">
                {links.map(({ label, href, count }) => (
                    <Link key={label} href={href}>
                        <Card className="transition-shadow hover:shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {count !== null && <p className="text-2xl font-bold">{count}</p>}
                                <Button variant="link" className="mt-1 h-auto p-0 text-sm">
                                    View {label.toLowerCase()}
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
