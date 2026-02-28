'use client';

import { useParams } from 'next/navigation';
import { MemberList } from '@/components/havens/member-list';
import { MemberInviteDialog } from '@/components/havens/member-invite-dialog';

export default function MembersPage() {
    const params = useParams();
    const havenId = params.havenId as string;

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Members</h2>
                <MemberInviteDialog havenId={havenId} />
            </div>
            <MemberList havenId={havenId} />
        </div>
    );
}
