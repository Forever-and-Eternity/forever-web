export interface RegisterRequest {
    email: string;
    password: string;
    displayName: string;
    dateOfBirth?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RefreshRequest {
    refreshToken: string;
}

export interface UserPreferences {
    theme: string;
    locale: string;
    compactMode: boolean;
    contentLayout: string;
    showAnnotationsInFeed: boolean;
    emailNotifications: boolean;
    colorPalette: string;
    fontFamily: string;
}

export interface UpdateProfileRequest {
    displayName?: string;
    avatarUrl?: string;
    dateOfBirth?: string;
    preferences?: UserPreferences;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: UserProfile;
}

export interface UserProfile {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    dateOfBirth?: string;
    createdAt: string;
    preferences: UserPreferences;
}
