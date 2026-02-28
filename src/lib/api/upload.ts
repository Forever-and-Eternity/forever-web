import axios from 'axios';
import { contentApi } from './content';
import type { ContentType } from '@/lib/types/enums';
import type { ConfirmUploadRequest } from '@/lib/types/content';

export async function uploadFile(havenId: string, file: File, contentType: ContentType, metadata?: ConfirmUploadRequest) {
    // Step 1: Get presigned URL
    const { data: urlResponse } = await contentApi.getUploadUrl(havenId, {
        fileName: file.name,
        contentType,
        fileSize: file.size,
    });

    if (!urlResponse.data) {
        throw new Error('Failed to get upload URL');
    }

    const { presignedUrl, contentId } = urlResponse.data;

    // Step 2: Upload file to S3 via presigned URL
    await axios.put(presignedUrl, file, {
        headers: { 'Content-Type': file.type },
    });

    // Step 3: Confirm upload
    const { data: confirmResponse } = await contentApi.confirmUpload(havenId, contentId, metadata ?? {});

    return confirmResponse.data;
}
