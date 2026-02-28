'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Person } from '@/lib/types/people';

export function PersonCard({ person, havenId }: { person: Person; havenId: string }) {
    return (
        <Link href={`/havens/${havenId}/people/${person.id}`}>
            <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-3 p-4">
                    <Avatar>
                        <AvatarFallback>{person.displayName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{person.displayName}</p>
                        {person.relationship && <p className="text-sm text-muted-foreground">{person.relationship}</p>}
                    </div>
                    {person.tagCount > 0 && <Badge variant="secondary">{person.tagCount} tags</Badge>}
                </CardContent>
            </Card>
        </Link>
    );
}
