import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Haven } from '@/lib/types/haven';
import { HavenCard } from './haven-card';

const baseHaven: Haven = {
    id: '1',
    name: 'Family Memories',
    description: 'A collection of our favorite family moments, photos, and stories from over the years.',
    ownerId: 'user-1',
    ownerDisplayName: 'Jane Doe',
    memberCount: 5,
    contentCount: 42,
    peopleCount: 12,
    diaryCount: 8,
    capsuleCount: 3,
    lessonCount: 5,
    storageSizeBytes: 524288000,
    lastActivityAt: '2024-12-20T14:30:00Z',
    createdAt: '2024-01-15T10:30:00Z',
};

const meta = {
    title: 'Havens/HavenCard',
    component: HavenCard,
    parameters: {
        layout: 'centered',
        nextjs: {
            appDirectory: true,
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="w-[360px] p-4">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof HavenCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        haven: baseHaven,
    },
};

export const WithLongDescription: Story = {
    args: {
        haven: {
            ...baseHaven,
            id: '2',
            name: 'Summer Vacation 2024',
            description:
                'Photos and videos from our amazing trip to the coast. We visited three different beaches, went snorkeling, and had the most incredible sunsets every evening. This was truly a trip to remember forever.',
            contentCount: 128,
            memberCount: 8,
        },
    },
};

export const WithoutDescription: Story = {
    args: {
        haven: {
            ...baseHaven,
            id: '3',
            name: 'Quick Captures',
            description: undefined,
            contentCount: 7,
            memberCount: 1,
        },
    },
};

export const EmptyHaven: Story = {
    args: {
        haven: {
            ...baseHaven,
            id: '4',
            name: 'New Haven',
            description: 'Just getting started!',
            contentCount: 0,
            memberCount: 1,
        },
    },
};

export const LargeCollection: Story = {
    args: {
        haven: {
            ...baseHaven,
            id: '5',
            name: 'Grandpa\'s Archive',
            description: 'Decades of family history, documents, and photographs lovingly preserved.',
            contentCount: 2847,
            memberCount: 23,
        },
    },
};

export const CardGrid: Story = {
    args: { haven: baseHaven },
    decorators: [
        () => (
            <div className="grid w-[800px] grid-cols-2 gap-4 p-4">
                <HavenCard haven={baseHaven} />
                <HavenCard
                    haven={{
                        ...baseHaven,
                        id: '2',
                        name: 'Summer Vacation 2024',
                        description: 'Photos from the beach trip',
                        contentCount: 128,
                        memberCount: 8,
                    }}
                />
                <HavenCard
                    haven={{
                        ...baseHaven,
                        id: '3',
                        name: 'Quick Captures',
                        description: undefined,
                        contentCount: 7,
                        memberCount: 1,
                    }}
                />
                <HavenCard
                    haven={{
                        ...baseHaven,
                        id: '4',
                        name: 'Wedding Album',
                        description: 'Our special day captured in beautiful moments',
                        contentCount: 350,
                        memberCount: 12,
                    }}
                />
            </div>
        ),
    ],
};
