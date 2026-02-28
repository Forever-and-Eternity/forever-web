'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { havensApi } from '@/lib/api/havens';
import { HavenRoleLabels } from '@/lib/types/enums';
import type { HavenMember } from '@/lib/types/haven';

export function MemberList({ havenId }: { havenId: string }) {
    const [members, setMembers] = useState<HavenMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        havensApi
            .getMembers(havenId)
            .then(({ data: res }) => {
                if (res.success && res.data) setMembers(res.data);
            })
            .finally(() => setLoading(false));
    }, [havenId]);

    async function handleRemove(memberId: string) {
        await havensApi.removeMember(havenId, memberId);
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }

    if (loading) return <p className="text-sm text-muted-foreground">Loading members...</p>;

    return (
        <div className="space-y-2">
            {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>{member.displayName?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{member.displayName || member.email}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge variant="outline">{HavenRoleLabels[member.role]}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleRemove(member.id)}>
                        Remove
                    </Button>
                </div>
            ))}
        </div>
    );
}
