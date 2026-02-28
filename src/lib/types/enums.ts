export enum ContentType {
    Photo = 'Photo',
    Video = 'Video',
    Audio = 'Audio',
    Text = 'Text',
    Document = 'Document',
}

export enum HavenRole {
    Owner = 'Owner',
    Contributor = 'Contributor',
    Recipient = 'Recipient',
}

export enum AnnotationType {
    MemoryNote = 'MemoryNote',
    Location = 'Location',
    DateContext = 'DateContext',
    Lesson = 'Lesson',
}

export enum InviteStatus {
    Sent = 'Sent',
    Opened = 'Opened',
    Registered = 'Registered',
    Expired = 'Expired',
    Declined = 'Declined',
}

export const ContentTypeLabels: Record<ContentType, string> = {
    [ContentType.Photo]: 'Photo',
    [ContentType.Video]: 'Video',
    [ContentType.Audio]: 'Audio',
    [ContentType.Text]: 'Text',
    [ContentType.Document]: 'Document',
};

export const HavenRoleLabels: Record<HavenRole, string> = {
    [HavenRole.Owner]: 'Owner',
    [HavenRole.Contributor]: 'Contributor',
    [HavenRole.Recipient]: 'Recipient',
};

export const AnnotationTypeLabels: Record<AnnotationType, string> = {
    [AnnotationType.MemoryNote]: 'Memory Note',
    [AnnotationType.Location]: 'Location',
    [AnnotationType.DateContext]: 'Date Context',
    [AnnotationType.Lesson]: 'Lesson',
};
