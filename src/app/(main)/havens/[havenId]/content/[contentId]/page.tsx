'use client';

import { useParams } from 'next/navigation';
import { ContentDetail } from '@/components/content/content-detail';

export default function ContentDetailPage() {
    const params = useParams();
    const havenId = params.havenId as string;
    const contentId = params.contentId as string;

    return <ContentDetail havenId={havenId} contentId={contentId} />;
}
