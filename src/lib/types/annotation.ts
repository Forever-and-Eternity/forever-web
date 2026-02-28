import { AnnotationType } from './enums';

export interface CreateAnnotationRequest {
    body: string;
    annotationType?: AnnotationType;
    pinX?: number;
    pinY?: number;
    photoDate?: string;
    photoLocation?: string;
}

export interface Annotation {
    id: string;
    contentId: string;
    authorId?: string;
    authorDisplayName?: string;
    annotationType: AnnotationType;
    body: string;
    pinX?: number;
    pinY?: number;
    photoDate?: string;
    photoLocation?: string;
    createdAt: string;
    updatedAt: string;
}
