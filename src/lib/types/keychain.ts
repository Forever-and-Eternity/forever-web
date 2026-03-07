export interface KeychainCategory {
    id: string;
    havenId: string;
    name: string;
    icon?: string;
    sortOrder: number;
    entryCount: number;
    createdAt: string;
}

export interface CreateCategoryRequest {
    name: string;
    icon?: string;
    sortOrder: number;
}

export interface KeychainEntryList {
    id: string;
    categoryId: string;
    label: string;
    entryType: string;
    notes?: string;
    attachmentCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface KeychainEntry extends KeychainEntryList {
    havenId: string;
    encryptedData: string;
    iv: string;
    contentIds: string[];
}

export interface CreateEntryRequest {
    categoryId: string;
    label: string;
    entryType: string;
    encryptedData: string;
    iv: string;
    notes?: string;
    contentIds: string[];
}

export interface UpdateEntryRequest {
    label: string;
    entryType: string;
    encryptedData: string;
    iv: string;
    notes?: string;
    contentIds: string[];
}

export interface UnlockResult {
    sessionToken: string;
    expiresAt: string;
}

// Unencrypted field structure for client-side use
export interface LoginFields {
    website?: string;
    username?: string;
    password?: string;
}

export interface BankFields {
    bankName?: string;
    accountNumber?: string;
    sortCode?: string;
    iban?: string;
    swift?: string;
}

export interface InsuranceFields {
    provider?: string;
    policyNumber?: string;
    type?: string;
    expiryDate?: string;
    contactPhone?: string;
}

export interface LegalFields {
    documentType?: string;
    reference?: string;
    issuer?: string;
    expiryDate?: string;
    details?: string;
}

export interface NoteFields {
    content?: string;
}

export type EntryFields = LoginFields | BankFields | InsuranceFields | LegalFields | NoteFields;
