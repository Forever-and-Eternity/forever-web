import { InviteStatus } from './enums';

export interface CreatePersonRequest {
    displayName: string;
    relationship?: string;
    email?: string;
    phone?: string;
}

export interface UpdatePersonRequest {
    displayName?: string;
    relationship?: string;
    email?: string;
    phone?: string;
}

export interface TagContentRequest {
    personId?: string;
    newPersonName?: string;
    relationship?: string;
    faceX?: number;
    faceY?: number;
}

export interface Person {
    id: string;
    displayName: string;
    relationship?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    linkedUserId?: string;
    inviteStatus: InviteStatus;
    tagCount: number;
    createdAt: string;
}

export interface PersonTag {
    id: string;
    personId: string;
    personDisplayName: string;
    relationship?: string;
    faceX?: number;
    faceY?: number;
    createdAt: string;
}
