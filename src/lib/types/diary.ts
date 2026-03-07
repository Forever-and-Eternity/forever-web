export interface DiaryEntry {
    id: string;
    havenId: string;
    authorId: string;
    authorDisplayName?: string;
    body: string;
    mood?: string;
    moodEmoji?: string;
    locationName?: string;
    tags: string[];
    isPrivate: boolean;
    contentIds: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateDiaryEntryRequest {
    body: string;
    mood?: string;
    moodEmoji?: string;
    locationName?: string;
    tags: string[];
    contentIds: string[];
    isPrivate: boolean;
}

export interface UpdateDiaryEntryRequest {
    body: string;
    mood?: string;
    moodEmoji?: string;
    locationName?: string;
    tags: string[];
    contentIds: string[];
    isPrivate: boolean;
}

export interface DiaryStreak {
    currentStreak: number;
    longestStreak: number;
    lastEntryDate?: string;
}
