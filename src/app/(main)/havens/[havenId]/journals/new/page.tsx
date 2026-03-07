'use client';

import { useParams } from 'next/navigation';
import { DiaryEntryForm } from '@/components/diary/diary-entry-form';

export default function NewJournalEntryPage() {
    const params = useParams();
    const havenId = params.havenId as string;

    return (
        <div className="py-2">
            <DiaryEntryForm havenId={havenId} />
        </div>
    );
}
