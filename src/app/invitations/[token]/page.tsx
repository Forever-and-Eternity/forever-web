'use client';

import { useParams } from 'next/navigation';
import { InvitationPreview } from '@/components/invitations/invitation-preview';
import { AcceptForm } from '@/components/invitations/accept-form';

export default function InvitationPage() {
    const params = useParams();
    const token = params.token as string;

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-md space-y-6">
                <InvitationPreview token={token} />
                <AcceptForm token={token} />
            </div>
        </div>
    );
}
