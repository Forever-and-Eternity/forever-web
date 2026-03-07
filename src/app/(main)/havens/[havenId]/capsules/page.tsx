'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CapsuleList } from '@/components/capsules/capsule-list';
import { Plus } from 'lucide-react';

export default function CapsulesPage() {
    const params = useParams();
    const havenId = params.havenId as string;

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">Capsules</h1>
                    <p className="text-sm text-muted-foreground">Time-locked messages for your loved ones.</p>
                </div>
                <Button size="sm" asChild>
                    <Link href={`/havens/${havenId}/capsules/new`}>
                        <Plus className="h-4 w-4 mr-1" />
                        New Capsule
                    </Link>
                </Button>
            </div>
            <CapsuleList havenId={havenId} />
        </div>
    );
}
