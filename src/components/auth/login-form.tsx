'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth-store';

export function LoginForm() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data: res } = await authApi.login({ email, password });
            if (res.success && res.data) {
                setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
                router.push('/dashboard');
            } else {
                setError(res.errors[0] || 'Login failed');
            }
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { errors?: string[] } } };
            setError(axiosErr.response?.data?.errors?.[0] || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl" style={{ fontFamily: 'var(--font-display-var), sans-serif' }}>Welcome back</CardTitle>
                <CardDescription>Sign in to your <span className="text-gradient-ig font-semibold">Forever</span> account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="pr-10" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-ig text-white hover:opacity-90 font-semibold" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-primary hover:underline">
                            Create one
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
