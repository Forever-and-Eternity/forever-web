import api from './client';
import type { ApiResponse } from '@/lib/types/api';
import type { AcceptInvitationRequest, InvitationPreview } from '@/lib/types/invitation';
import type { LoginResponse } from '@/lib/types/auth';

export const invitationsApi = {
    preview: (token: string) => api.get<ApiResponse<InvitationPreview>>(`/invitations/${token}/preview`),

    accept: (token: string, data: AcceptInvitationRequest) => api.post<ApiResponse<LoginResponse>>(`/invitations/${token}/accept`, data),
};
