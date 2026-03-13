import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ContentType, AnnotationType } from '@/lib/types/enums';
import type { ContentItem } from '@/lib/types/content';
import { ContentCard } from './content-card';

const baseItem: ContentItem = {
    id: 'content-1',
    havenId: 'haven-1',
    uploaderId: 'user-1',
    uploaderDisplayName: 'Jane Doe',
    contentType: ContentType.Photo,
    title: 'Sunset at the beach',
    description: 'Golden hour on the coast',
    thumbnailUrl: 'https://picsum.photos/id/10/400/400',
    mediaUrl: 'https://picsum.photos/id/10/1200/800',
    tags: ['sunset', 'beach'],
    fileSize: 2457600,
    createdAt: '2025-06-15T18:30:00Z',
    annotations: [],
    peopleTags: [],
};

const meta = {
    title: 'Content/ContentCard',
    component: ContentCard,
    parameters: {
        layout: 'centered',
        nextjs: { appDirectory: true },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="w-[240px] p-4">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ContentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Photo: Story = {
    args: {
        item: baseItem,
        havenId: 'haven-1',
    },
};

export const WithAnnotations: Story = {
    args: {
        item: {
            ...baseItem,
            id: 'content-2',
            title: 'Family dinner',
            thumbnailUrl: 'https://picsum.photos/id/42/400/400',
            annotations: [
                {
                    id: 'ann-1',
                    contentId: 'content-2',
                    authorDisplayName: 'Jane Doe',
                    annotationType: AnnotationType.MemoryNote,
                    body: 'Everyone was laughing',
                    createdAt: '2025-06-16T10:00:00Z',
                    updatedAt: '2025-06-16T10:00:00Z',
                },
                {
                    id: 'ann-2',
                    contentId: 'content-2',
                    authorDisplayName: 'Marcus Chen',
                    annotationType: AnnotationType.Location,
                    body: "Grandma's house",
                    photoLocation: '42 Maple Street',
                    createdAt: '2025-06-16T11:00:00Z',
                    updatedAt: '2025-06-16T11:00:00Z',
                },
            ],
        },
        havenId: 'haven-1',
    },
};

export const DocumentType: Story = {
    args: {
        item: {
            ...baseItem,
            id: 'content-3',
            contentType: ContentType.Document,
            title: 'Insurance Policy',
            thumbnailUrl: undefined,
            mediaUrl: undefined,
        },
        havenId: 'haven-1',
    },
};

export const NoTitle: Story = {
    args: {
        item: {
            ...baseItem,
            id: 'content-4',
            title: undefined,
            thumbnailUrl: 'https://picsum.photos/id/15/400/400',
        },
        havenId: 'haven-1',
    },
};

export const VideoType: Story = {
    args: {
        item: {
            ...baseItem,
            id: 'content-5',
            contentType: ContentType.Video,
            title: 'Birthday party',
            thumbnailUrl: 'https://picsum.photos/id/24/400/400',
        },
        havenId: 'haven-1',
    },
};

export const CardGrid: Story = {
    args: { item: baseItem, havenId: 'haven-1' },
    decorators: [
        () => (
            <div className="grid w-[800px] grid-cols-3 gap-4 p-4">
                <ContentCard item={baseItem} havenId="haven-1" />
                <ContentCard
                    item={{ ...baseItem, id: '2', contentType: ContentType.Video, title: 'Birthday party', thumbnailUrl: 'https://picsum.photos/id/24/400/400' }}
                    havenId="haven-1"
                />
                <ContentCard
                    item={{ ...baseItem, id: '3', contentType: ContentType.Document, title: 'Insurance Policy', thumbnailUrl: undefined, mediaUrl: undefined }}
                    havenId="haven-1"
                />
                <ContentCard
                    item={{ ...baseItem, id: '4', title: 'Mountain hike', thumbnailUrl: 'https://picsum.photos/id/29/400/400' }}
                    havenId="haven-1"
                />
                <ContentCard
                    item={{ ...baseItem, id: '5', contentType: ContentType.Audio, title: 'Voicemail from grandpa', thumbnailUrl: undefined, mediaUrl: undefined }}
                    havenId="haven-1"
                />
                <ContentCard
                    item={{ ...baseItem, id: '6', title: 'Garden in bloom', thumbnailUrl: 'https://picsum.photos/id/36/400/400' }}
                    havenId="haven-1"
                />
            </div>
        ),
    ],
};
