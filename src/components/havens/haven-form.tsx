'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { havensApi } from '@/lib/api/havens';
import { useHavenStore } from '@/lib/stores/haven-store';

export function HavenForm() {
    const router = useRouter();
    const addHaven = useHavenStore((s) => s.addHaven);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data: res } = await havensApi.create({
                name,
                description: description || undefined,
            });
            if (res.success && res.data) {
                addHaven(res.data);
                router.push(`/havens/${res.data.id}`);
            } else {
                setError(res.errors[0] || 'Failed to create haven');
            }
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { errors?: string[] } } };
            setError(axiosErr.response?.data?.errors?.[0] || 'Failed to create haven');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>Create a new Haven</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Family Memories"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            maxLength={200}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="A place for our family photos and stories..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={1000}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Haven'}
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
