import { InviteStatus } from './enums';

export interface AcceptInvitationRequest {
    email: string;
    password: string;
    displayName: string;
}

export interface Invitation {
    id: string;
    havenId: string;
    inviterDisplayName?: string;
    inviteeEmail?: string;
    inviteType?: string;
    status: InviteStatus;
    inviteToken?: string;
    sentAt: string;
    expiresAt: string;
}

export interface InvitationPreview {
    inviterDisplayName: string;
    personDisplayName?: string;
    relationship?: string;
    photoThumbnailUrl?: string;
    annotationText?: string;
    havenName: string;
}
