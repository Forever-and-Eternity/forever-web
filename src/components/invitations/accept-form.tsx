'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { invitationsApi } from '@/lib/api/invitations';
import { useAuthStore } from '@/lib/stores/auth-store';

export function AcceptForm({ token }: { token: string }) {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data: res } = await invitationsApi.accept(token, {
                email,
                password,
                displayName,
            });
            if (res.success && res.data) {
                setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
                router.push('/havens');
            } else {
                setError(res.errors[0] || 'Failed to accept invitation');
            }
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { errors?: string[] } } };
            setError(axiosErr.response?.data?.errors?.[0] || 'Failed to accept invitation');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Accept Invitation</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Your name</Label>
                        <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Joining...' : 'Join & Create Account'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
