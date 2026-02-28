import { ContentType } from './enums';
import { Annotation } from './annotation';
import { PersonTag } from './people';

export interface FeedItem {
    id: string;
    contentType: ContentType;
    title?: string;
    description?: string;
    mediaUrl?: string;
    thumbnailUrl?: string;
    uploaderDisplayName?: string;
    locationName?: string;
    takenAt?: string;
    createdAt: string;
    annotations: Annotation[];
    peopleTags: PersonTag[];
}
