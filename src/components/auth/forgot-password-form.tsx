'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';

export function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authApi.forgotPassword(email);
            setSent(true);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    if (sent) {
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
                        Check your email
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                        If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link.
                        It expires in 1 hour.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setSent(false)}
                            className="w-full"
                        >
                            <Mail className="mr-2 h-4 w-4" />
                            Try a different email
                        </Button>
                        <Link href="/login" className="text-sm text-primary hover:underline mt-2">
                            Back to sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl" style={{ fontFamily: 'var(--font-display-var), sans-serif' }}>
                    Forgot password?
                </CardTitle>
                <CardDescription>
                    Enter your email and we&apos;ll send you a link to reset your password
                </CardDescription>
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
                    <Button
                        type="submit"
                        className="w-full bg-gradient-ig text-white hover:opacity-90 font-semibold"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send reset link'}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        <Link href="/login" className="inline-flex items-center gap-1 text-primary hover:underline">
                            <ArrowLeft className="h-3 w-3" />
                            Back to sign in
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
