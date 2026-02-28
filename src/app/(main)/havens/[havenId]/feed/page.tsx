'use client';

import { useParams } from 'next/navigation';
import { FeedList } from '@/components/feed/feed-list';

export default function FeedPage() {
    const params = useParams();
    const havenId = params.havenId as string;

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">Feed</h2>
            <FeedList havenId={havenId} />
        </div>
    );
}
