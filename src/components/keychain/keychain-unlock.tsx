'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { keychainApi } from '@/lib/api/keychain';
import { toast } from 'sonner';

interface KeychainUnlockProps {
  havenId: string;
  onUnlock: (password: string, sessionToken: string) => void;
}

export function KeychainUnlock({ havenId, onUnlock }: KeychainUnlockProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setError('');
    setLoading(true);
    try {
      const { data: res } = await keychainApi.unlock(havenId, password);
      if (res.success && res.data) {
        toast.success('Vault unlocked');
        onUnlock(password, res.data.sessionToken);
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Unlock Vault</CardTitle>
          <CardDescription>
            Re-enter your password to access the secure vault
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vault-password">Password</Label>
              <Input
                id="vault-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                autoFocus
                required
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !password.trim()}
            >
              {loading ? 'Unlocking...' : 'Unlock'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
