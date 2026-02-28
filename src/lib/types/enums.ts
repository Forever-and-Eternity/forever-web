export enum ContentType {
    Photo = 0,
    Video = 1,
    Audio = 2,
    Text = 3,
    Document = 4,
}

export enum HavenRole {
    Owner = 0,
    Contributor = 1,
    Recipient = 2,
}

export enum AnnotationType {
    MemoryNote = 0,
    Location = 1,
    DateContext = 2,
    Lesson = 3,
}

export enum InviteStatus {
    Sent = 0,
    Opened = 1,
    Registered = 2,
    Expired = 3,
    Declined = 4,
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
