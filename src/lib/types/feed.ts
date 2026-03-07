import { ContentType } from './enums';
import { Annotation } from './annotation';
import { PersonTag } from './people';

/** Legacy feed item type (content-based). Kept for backward compatibility. */
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

/** Activity-based feed item for the enhanced feed. */
export interface FeedActivity {
    id: string;
    activityType: string;
    title: string;
    description?: string;
    subjectId?: string;
    subjectType?: string;
    metadata?: Record<string, unknown>;
    userDisplayName: string;
    userAvatarUrl?: string;
    isDismissed: boolean;
    createdAt: string;
}
