import api from './client';
import type { ApiResponse, PaginatedResult } from '@/lib/types/api';
import type {
    BodyMapRegion,
    MedicalCondition,
    CreateConditionRequest,
    MedicalLog,
    CreateMedicalLogRequest,
    MedicationItem,
    CreateMedicationRequest,
    MedicalProvider,
    CreateProviderRequest,
    Allergy,
    CreateAllergyRequest,
} from '@/lib/types/health';

export const healthApi = {
    getBodyMap: (havenId: string) =>
        api.get<ApiResponse<BodyMapRegion[]>>(`/havens/${havenId}/health/body-map`),

    createCondition: (havenId: string, data: CreateConditionRequest) =>
        api.post<ApiResponse<MedicalCondition>>(`/havens/${havenId}/health/conditions`, data),
    getConditions: (havenId: string, page = 1, pageSize = 20, status?: string, region?: string) =>
        api.get<ApiResponse<PaginatedResult<MedicalCondition>>>(`/havens/${havenId}/health/conditions`, {
            params: { page, pageSize, status, region },
        }),
    updateCondition: (havenId: string, id: string, data: CreateConditionRequest) =>
        api.put<ApiResponse<MedicalCondition>>(`/havens/${havenId}/health/conditions/${id}`, data),
    deleteCondition: (havenId: string, id: string) =>
        api.delete<ApiResponse>(`/havens/${havenId}/health/conditions/${id}`),

    createLog: (havenId: string, data: CreateMedicalLogRequest) =>
        api.post<ApiResponse<MedicalLog>>(`/havens/${havenId}/health/log`, data),
    getLogs: (havenId: string, page = 1, pageSize = 20, region?: string) =>
        api.get<ApiResponse<PaginatedResult<MedicalLog>>>(`/havens/${havenId}/health/log`, {
            params: { page, pageSize, region },
        }),

    createMedication: (havenId: string, data: CreateMedicationRequest) =>
        api.post<ApiResponse<MedicationItem>>(`/havens/${havenId}/health/medications`, data),
    getMedications: (havenId: string, currentOnly?: boolean) =>
        api.get<ApiResponse<MedicationItem[]>>(`/havens/${havenId}/health/medications`, {
            params: { currentOnly },
        }),
    updateMedication: (havenId: string, id: string, data: CreateMedicationRequest) =>
        api.put<ApiResponse<MedicationItem>>(`/havens/${havenId}/health/medications/${id}`, data),
    deleteMedication: (havenId: string, id: string) =>
        api.delete<ApiResponse>(`/havens/${havenId}/health/medications/${id}`),

    createProvider: (havenId: string, data: CreateProviderRequest) =>
        api.post<ApiResponse<MedicalProvider>>(`/havens/${havenId}/health/providers`, data),
    getProviders: (havenId: string) =>
        api.get<ApiResponse<MedicalProvider[]>>(`/havens/${havenId}/health/providers`),

    createAllergy: (havenId: string, data: CreateAllergyRequest) =>
        api.post<ApiResponse<Allergy>>(`/havens/${havenId}/health/allergies`, data),
    getAllergies: (havenId: string) =>
        api.get<ApiResponse<Allergy[]>>(`/havens/${havenId}/health/allergies`),
};
