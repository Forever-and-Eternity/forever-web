import { ContentType } from './enums';
import { Annotation } from './annotation';
import { PersonTag } from './people';

export interface UploadUrlRequest {
    fileName: string;
    contentType: ContentType;
    fileSize: number;
}

export interface ConfirmUploadRequest {
    title?: string;
    description?: string;
    tags?: string[];
}

export interface UploadUrlResponse {
    presignedUrl: string;
    contentId: string;
    s3Key: string;
}

export interface ContentItem {
    id: string;
    havenId: string;
    uploaderId?: string;
    uploaderDisplayName?: string;
    contentType: ContentType;
    title?: string;
    description?: string;
    mediaUrl?: string;
    thumbnailUrl?: string;
    tags: string[];
    latitude?: number;
    longitude?: number;
    locationName?: string;
    fileSize: number;
    takenAt?: string;
    createdAt: string;
    annotations: Annotation[];
    peopleTags: PersonTag[];
}
