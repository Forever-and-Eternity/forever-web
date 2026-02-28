'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ContentGrid } from '@/components/content/content-grid';

export default function ContentPage() {
    const params = useParams();
    const havenId = params.havenId as string;

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Content</h2>
                <Link href={`/havens/${havenId}/content/upload`}>
                    <Button>Upload</Button>
                </Link>
            </div>
            <ContentGrid havenId={havenId} />
        </div>
    );
}
