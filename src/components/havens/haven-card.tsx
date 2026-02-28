'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Haven } from '@/lib/types/haven';

export function HavenCard({ haven }: { haven: Haven }) {
    return (
        <Link href={`/havens/${haven.id}`}>
            <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{haven.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    {haven.description && <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{haven.description}</p>}
                    <div className="flex gap-2">
                        <Badge variant="secondary">{haven.contentCount} items</Badge>
                        <Badge variant="outline">{haven.memberCount} members</Badge>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
