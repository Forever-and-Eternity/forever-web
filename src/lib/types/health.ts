export interface BodyMapRegion {
    bodyRegion: string;
    conditionCount: number;
}

export interface MedicalCondition {
    id: string;
    havenId: string;
    authorId: string;
    name: string;
    bodyRegion: string;
    severity?: string;
    status: string;
    notes?: string;
    diagnosedAt?: string;
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateConditionRequest {
    name: string;
    bodyRegion: string;
    severity?: string;
    status: string;
    notes?: string;
    diagnosedAt?: string;
}

export interface MedicalLog {
    id: string;
    havenId: string;
    authorId: string;
    title: string;
    description?: string;
    bodyRegion?: string;
    logDate: string;
    createdAt: string;
}

export interface CreateMedicalLogRequest {
    title: string;
    description?: string;
    bodyRegion?: string;
    logDate: string;
}

export interface MedicationItem {
    id: string;
    havenId: string;
    authorId: string;
    name: string;
    dosage?: string;
    frequency?: string;
    notes?: string;
    isCurrent: boolean;
    startedAt?: string;
    endedAt?: string;
    createdAt: string;
}

export interface CreateMedicationRequest {
    name: string;
    dosage?: string;
    frequency?: string;
    notes?: string;
    isCurrent: boolean;
    startedAt?: string;
}

export interface MedicalProvider {
    id: string;
    havenId: string;
    authorId: string;
    name: string;
    specialty?: string;
    phone?: string;
    address?: string;
    notes?: string;
    createdAt: string;
}

export interface CreateProviderRequest {
    name: string;
    specialty?: string;
    phone?: string;
    address?: string;
    notes?: string;
}

export interface Allergy {
    id: string;
    havenId: string;
    authorId: string;
    name: string;
    severity?: string;
    reaction?: string;
    notes?: string;
    createdAt: string;
}

export interface CreateAllergyRequest {
    name: string;
    severity?: string;
    reaction?: string;
    notes?: string;
}
