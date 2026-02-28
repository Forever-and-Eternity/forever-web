'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PersonForm } from '@/components/people/person-form';
import { peopleApi } from '@/lib/api/people';
import { toast } from 'sonner';
import type { Person } from '@/lib/types/people';

export default function PersonDetailPage() {
    const params = useParams();
    const router = useRouter();
    const havenId = params.havenId as string;
    const personId = params.personId as string;
    const [person, setPerson] = useState<Person | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        peopleApi
            .get(havenId, personId)
            .then(({ data: res }) => {
                if (res.success && res.data) setPerson(res.data);
            })
            .finally(() => setLoading(false));
    }, [havenId, personId]);

    async function handleInvite() {
        try {
            await peopleApi.invite(havenId, personId);
            toast.success('Invitation sent');
        } catch {
            toast.error('Failed to send invitation');
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to remove this person?')) return;
        await peopleApi.delete(havenId, personId);
        router.push(`/havens/${havenId}/people`);
    }

    if (loading) return <Skeleton className="h-64 rounded-lg" />;
    if (!person) return <p>Person not found</p>;
    if (editing) return <PersonForm havenId={havenId} person={person} />;

    return (
        <Card className="max-w-lg">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-xl">{person.displayName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{person.displayName}</CardTitle>
                        {person.relationship && <p className="text-muted-foreground">{person.relationship}</p>}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {person.email && (
                    <p className="text-sm">
                        <span className="text-muted-foreground">Email:</span> {person.email}
                    </p>
                )}
                {person.phone && (
                    <p className="text-sm">
                        <span className="text-muted-foreground">Phone:</span> {person.phone}
                    </p>
                )}
                <div className="flex gap-2">
                    <Badge variant="secondary">{person.tagCount} tags</Badge>
                </div>
                <div className="flex gap-2 pt-2">
                    <Button variant="outline" onClick={() => setEditing(true)}>
                        Edit
                    </Button>
                    {person.email && (
                        <Button variant="outline" onClick={handleInvite}>
                            Send Invite
                        </Button>
                    )}
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
