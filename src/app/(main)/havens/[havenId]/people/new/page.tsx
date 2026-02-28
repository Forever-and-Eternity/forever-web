'use client';

import { useParams } from 'next/navigation';
import { PersonForm } from '@/components/people/person-form';

export default function NewPersonPage() {
    const params = useParams();
    const havenId = params.havenId as string;

    return <PersonForm havenId={havenId} />;
}
