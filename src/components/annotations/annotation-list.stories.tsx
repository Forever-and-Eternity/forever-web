import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { AnnotationType } from '@/lib/types/enums';
import type { Annotation } from '@/lib/types/annotation';
import { AnnotationList } from './annotation-list';

const mockAnnotations: Annotation[] = [
    {
        id: 'ann-1',
        contentId: 'content-1',
        authorId: 'user-1',
        authorDisplayName: 'Jane Doe',
        annotationType: AnnotationType.MemoryNote,
        body: 'I remember this day so clearly. The light was perfect and everyone was laughing.',
        createdAt: '2025-06-15T10:00:00Z',
        updatedAt: '2025-06-15T10:00:00Z',
    },
    {
        id: 'ann-2',
        contentId: 'content-1',
        authorId: 'user-2',
        authorDisplayName: 'Marcus Chen',
        annotationType: AnnotationType.Location,
        body: "Grandma's house, 42 Maple Street",
        photoLocation: '42 Maple Street, Springfield',
        createdAt: '2025-06-16T14:00:00Z',
        updatedAt: '2025-06-16T14:00:00Z',
    },
    {
        id: 'ann-3',
        contentId: 'content-1',
        authorId: 'user-1',
        authorDisplayName: 'Jane Doe',
        annotationType: AnnotationType.DateContext,
        body: 'Summer 2024 - right before the big move to the new house.',
        createdAt: '2025-06-17T09:00:00Z',
        updatedAt: '2025-06-17T09:00:00Z',
    },
    {
        id: 'ann-4',
        contentId: 'content-1',
        authorId: 'user-3',
        authorDisplayName: 'Sarah Williams',
        annotationType: AnnotationType.Lesson,
        body: 'Always take time to be present with family. These moments pass so quickly.',
        createdAt: '2025-06-18T16:00:00Z',
        updatedAt: '2025-06-18T16:00:00Z',
    },
];

const meta = {
    title: 'Annotations/AnnotationList',
    component: AnnotationList,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="w-[500px] p-4">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof AnnotationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAnnotations: Story = {
    args: {
        annotations: mockAnnotations,
        contentId: 'content-1',
        onDeleted: fn(),
    },
};

export const SingleAnnotation: Story = {
    args: {
        annotations: [mockAnnotations[0]],
        contentId: 'content-1',
        onDeleted: fn(),
    },
};

export const Empty: Story = {
    args: {
        annotations: [],
        contentId: 'content-1',
        onDeleted: fn(),
    },
};
