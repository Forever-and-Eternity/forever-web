'use client';

import { useParams } from 'next/navigation';
import { UploadDropzone } from '@/components/content/upload-dropzone';

export default function UploadPage() {
    const params = useParams();
    const havenId = params.havenId as string;

    return <UploadDropzone havenId={havenId} />;
}
