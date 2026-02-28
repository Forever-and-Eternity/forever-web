'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { havensApi } from '@/lib/api/havens';
import { HavenRole } from '@/lib/types/enums';
import { toast } from 'sonner';

export function MemberInviteDialog({ havenId }: { havenId: string }) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<string>(String(HavenRole.Recipient));
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: res } = await havensApi.inviteMember(havenId, {
                email,
                role: Number(role) as HavenRole,
            });
            if (res.success) {
                toast.success('Invitation sent');
                setOpen(false);
                setEmail('');
            } else {
                toast.error(res.errors[0] || 'Failed to invite');
            }
        } catch {
            toast.error('Failed to send invitation');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Invite Member</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite a member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="inviteEmail">Email address</Label>
                        <Input id="inviteEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={String(HavenRole.Contributor)}>Contributor</SelectItem>
                                <SelectItem value={String(HavenRole.Recipient)}>Recipient</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Invitation'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
