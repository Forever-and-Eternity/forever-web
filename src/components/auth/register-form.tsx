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

export function RegisterForm() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const passwordStrength = (() => {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        return score;
    })();

    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][passwordStrength] || '';
    const strengthColor = ['', 'bg-destructive', 'bg-orange-500', 'bg-yellow-500', 'bg-primary', 'bg-green-500'][passwordStrength] || '';

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (passwordStrength < 3) {
            setError('Password is too weak. Use at least 8 characters with uppercase, lowercase, numbers, and symbols.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const { data: res } = await authApi.register({
                email,
                password,
                displayName,
            });
            if (res.success && res.data) {
                setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
                router.push('/dashboard');
            } else {
                setError(res.errors[0] || 'Registration failed');
            }
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { errors?: string[] } } };
            setError(axiosErr.response?.data?.errors?.[0] || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl" style={{ fontFamily: 'var(--font-display-var), sans-serif' }}>Create your account</CardTitle>
                <CardDescription>Start preserving memories <span className="text-gradient-ig font-semibold">forever</span></CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Display name</Label>
                        <Input
                            id="displayName"
                            placeholder="Your name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                    </div>
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
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="pr-10"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {password && (
                            <div className="space-y-1">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength ? strengthColor : 'bg-muted'}`} />
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">{strengthLabel}</p>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                className="pr-10"
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-xs text-destructive">Passwords do not match</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full bg-gradient-ig text-white hover:opacity-90 font-semibold" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create account'}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
