'use client';

import { useParams } from 'next/navigation';
import { CapsuleCreateWizard } from '@/components/capsules/capsule-create-wizard';

export default function NewCapsulePage() {
    const params = useParams();
    const havenId = params.havenId as string;

    return (
        <div className="py-2">
            <CapsuleCreateWizard havenId={havenId} />
        </div>
    );
}
