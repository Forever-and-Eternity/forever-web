'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Haven } from '@/lib/types/haven';

export function HavenCard({ haven }: { haven: Haven }) {
    return (
        <Link href={`/havens/${haven.id}`}>
            <Card className="group transition-all hover:shadow-lg hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-ig text-sm font-bold text-white shrink-0">
                            {haven.name.charAt(0).toUpperCase()}
                        </span>
                        <CardTitle className="text-lg group-hover:text-gradient-warm transition-colors">{haven.name}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {haven.description && <p className="mb-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">{haven.description}</p>}
                    <div className="flex gap-2">
                        <Badge variant="secondary" className="font-normal">{haven.contentCount} items</Badge>
                        <Badge variant="outline" className="font-normal">{haven.memberCount} members</Badge>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
