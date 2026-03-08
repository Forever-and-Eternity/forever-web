'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Haven } from '@/lib/types/haven';

export function HavenCard({ haven }: { haven: Haven }) {
    return (
        <Link href={`/havens/${haven.id}`}>
            <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
                {/* Cover image strip or gradient fallback */}
                {haven.coverImageUrl ? (
                    <div className="h-28 w-full overflow-hidden">
                        <img
                            src={haven.coverImageUrl}
                            alt=""
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                    </div>
                ) : (
                    <div className="flex h-28 w-full items-center justify-center bg-gradient-ig">
                        <span className="text-3xl font-bold text-white/80">
                            {haven.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                <CardHeader className="pb-2">
                    <CardTitle className="text-lg group-hover:text-gradient-warm transition-colors">{haven.name}</CardTitle>
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
