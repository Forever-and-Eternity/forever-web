export interface Lesson {
    id: string;
    havenId: string;
    authorId: string;
    authorDisplayName?: string;
    title: string;
    body: string;
    category: string;
    contentItemId?: string;
    ageRelevant?: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateLessonRequest {
    title: string;
    body: string;
    category: string;
    contentItemId?: string;
    ageRelevant?: string;
    tags: string[];
}

export interface UpdateLessonRequest {
    title: string;
    body: string;
    category: string;
    contentItemId?: string;
    ageRelevant?: string;
    tags: string[];
}

export interface LessonCategory {
    category: string;
    count: number;
}
