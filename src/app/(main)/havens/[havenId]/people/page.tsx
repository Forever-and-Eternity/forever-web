'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PersonCard } from '@/components/people/person-card';
import { peopleApi } from '@/lib/api/people';
import type { Person } from '@/lib/types/people';

export default function PeoplePage() {
    const params = useParams();
    const havenId = params.havenId as string;
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        peopleApi
            .list(havenId)
            .then(({ data: res }) => {
                if (res.success && res.data) setPeople(res.data);
            })
            .finally(() => setLoading(false));
    }, [havenId]);

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">People</h2>
                <Link href={`/havens/${havenId}/people/new`}>
                    <Button>Add Person</Button>
                </Link>
            </div>

            {loading ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 rounded-lg" />
                    ))}
                </div>
            ) : people.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center">
                    <h3 className="text-lg font-medium">No people yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Add people to tag them in your content.</p>
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {people.map((person) => (
                        <PersonCard key={person.id} person={person} havenId={havenId} />
                    ))}
                </div>
            )}
        </div>
    );
}
