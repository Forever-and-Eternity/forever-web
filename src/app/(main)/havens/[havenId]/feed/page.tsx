'use client';

import { useParams } from 'next/navigation';
import { FeedList } from '@/components/feed/feed-list';

export default function FeedPage() {
    const params = useParams();
    const havenId = params.havenId as string;

    return (
        <div>
            <FeedList havenId={havenId} />
        </div>
    );
}
