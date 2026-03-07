'use client';

import { useParams } from 'next/navigation';
import { LessonForm } from '@/components/lessons/lesson-form';

export default function NewLessonPage() {
    const params = useParams();
    const havenId = params.havenId as string;

    return (
        <div className="py-2">
            <LessonForm havenId={havenId} />
        </div>
    );
}
