'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!token) {
        return (
            <Card className="w-full max-w-md shadow-lg">
                <CardContent className="pt-8 pb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
                        <XCircle className="h-7 w-7 text-destructive" />
                    </div>
                    <h3
                        className="text-xl font-semibold mb-2"
                        style={{ fontFamily: 'var(--font-display-var), sans-serif' }}
                    >
                        Invalid reset link
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        This password reset link is missing or invalid.
                    </p>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        Request a new reset link
                    </Link>
                </CardContent>
            </Card>
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            const { data: res } = await authApi.resetPassword(token!, password);
            if (res.success) {
                setSuccess(true);
                setTimeout(() => router.push('/login'), 3000);
            } else {
                setError(res.errors?.[0] || 'Reset failed. The link may have expired.');
            }
        } catch {
            setError('Reset failed. The link may have expired.');
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <Card className="w-full max-w-md shadow-lg">
                <CardContent className="pt-8 pb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                        <CheckCircle2 className="h-7 w-7 text-primary" />
                    </div>
                    <h3
                        className="text-xl font-semibold mb-2"
                        style={{ fontFamily: 'var(--font-display-var), sans-serif' }}
                    >
                        Password reset!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Your password has been updated. Redirecting to sign in...
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl" style={{ fontFamily: 'var(--font-display-var), sans-serif' }}>
                    Set new password
                </CardTitle>
                <CardDescription>
                    Choose a strong password for your <span className="text-gradient-ig font-semibold">Forever</span> account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
                    <div className="space-y-2">
                        <Label htmlFor="password">New password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pr-10"
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input
                            id="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-ig text-white hover:opacity-90 font-semibold"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset password'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
