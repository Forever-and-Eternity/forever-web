export interface Capsule {
    id: string;
    havenId: string;
    creatorId: string;
    creatorDisplayName?: string;
    title: string;
    description?: string;
    emoji?: string;
    triggerType: string;  // "date" | "age" | "event" | "custom"
    unlockAt?: string;
    lifeEvent?: string;
    customEvent?: string;
    status: string;  // "draft" | "locked" | "unlocked"
    unlockedAt?: string;
    contentIds: string[];
    recipientIds: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateCapsuleRequest {
    title: string;
    description?: string;
    emoji?: string;
    triggerType: string;
    unlockAt?: string;
    lifeEvent?: string;
    customEvent?: string;
    contentIds: string[];
    recipientIds: string[];
}

export interface UpdateCapsuleRequest {
    title: string;
    description?: string;
    emoji?: string;
    triggerType: string;
    unlockAt?: string;
    lifeEvent?: string;
    customEvent?: string;
    contentIds: string[];
    recipientIds: string[];
}
