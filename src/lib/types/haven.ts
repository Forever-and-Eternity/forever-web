import { HavenRole } from './enums';

export interface CreateHavenRequest {
    name: string;
    description?: string;
}

export interface UpdateHavenRequest {
    name?: string;
    description?: string;
    coverImageUrl?: string;
}

export interface InviteMemberRequest {
    email: string;
    role?: HavenRole;
}

export interface Haven {
    id: string;
    name: string;
    description?: string;
    coverImageUrl?: string;
    ownerId: string;
    ownerDisplayName?: string;
    memberCount: number;
    contentCount: number;
    createdAt: string;
}

export interface HavenMember {
    id: string;
    userId?: string;
    displayName?: string;
    email?: string;
    role: HavenRole;
    invitedAt: string;
    acceptedAt?: string;
}
