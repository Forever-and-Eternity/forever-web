'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { invitationsApi } from '@/lib/api/invitations';
import type { InvitationPreview as InvitationPreviewType } from '@/lib/types/invitation';

export function InvitationPreview({ token }: { token: string }) {
    const [preview, setPreview] = useState<InvitationPreviewType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        invitationsApi
            .preview(token)
            .then(({ data: res }) => {
                if (res.success && res.data) setPreview(res.data);
                else setError('Invitation not found or expired');
            })
            .catch(() => setError('Invitation not found or expired'))
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) return <Skeleton className="h-64 rounded-lg" />;
    if (error) return <p className="text-destructive">{error}</p>;
    if (!preview) return null;

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">
                    {preview.inviterDisplayName} invited you to {preview.havenName}
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
                {preview.photoThumbnailUrl && (
                    <img src={preview.photoThumbnailUrl} alt="" className="mx-auto h-32 w-32 rounded-lg object-cover" />
                )}
                {preview.personDisplayName && (
                    <p className="text-muted-foreground">
                        Tagged as: {preview.personDisplayName}
                        {preview.relationship && ` (${preview.relationship})`}
                    </p>
                )}
                {preview.annotationText && <p className="italic text-muted-foreground">&ldquo;{preview.annotationText}&rdquo;</p>}
            </CardContent>
        </Card>
    );
}
