'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { peopleApi } from '@/lib/api/people';
import { toast } from 'sonner';
import type { Person } from '@/lib/types/people';

export function PersonForm({ havenId, person }: { havenId: string; person?: Person }) {
    const router = useRouter();
    const [displayName, setDisplayName] = useState(person?.displayName || '');
    const [relationship, setRelationship] = useState(person?.relationship || '');
    const [email, setEmail] = useState(person?.email || '');
    const [phone, setPhone] = useState(person?.phone || '');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                displayName,
                relationship: relationship || undefined,
                email: email || undefined,
                phone: phone || undefined,
            };

            if (person) {
                await peopleApi.update(havenId, person.id, data);
                toast.success('Person updated');
            } else {
                await peopleApi.create(havenId, data);
                toast.success('Person created');
            }
            router.push(`/havens/${havenId}/people`);
        } catch {
            toast.error('Failed to save');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>{person ? 'Edit Person' : 'Add a Person'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Name</Label>
                        <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            maxLength={100}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="relationship">Relationship</Label>
                        <Input
                            id="relationship"
                            placeholder="e.g., Grandmother, Friend"
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email (optional)</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : person ? 'Update' : 'Add Person'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
