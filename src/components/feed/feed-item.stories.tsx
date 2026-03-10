import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import type { FeedActivity } from '@/lib/types/feed';
import { FeedItemCard } from './feed-item';

const now = new Date().toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

const baseActivity: FeedActivity = {
    id: 'act-1',
    activityType: 'content_uploaded',
    title: 'Sunset at the beach',
    description: 'Golden hour on the coast, waves crashing gently',
    subjectId: 'content-1',
    subjectType: 'content',
    metadata: {
        thumbnailUrl: 'https://picsum.photos/id/10/200/200',
        contentType: 'Photo',
    },
    userDisplayName: 'Jane Doe',
    isDismissed: false,
    createdAt: hoursAgo(2),
};

const meta = {
    title: 'Feed/FeedItemCard',
    component: FeedItemCard,
    parameters: {
        layout: 'centered',
        nextjs: {
            appDirectory: true,
            navigation: { pathname: '/havens/haven-1/feed' },
        },
    },
    tags: ['autodocs'],
    args: {
        onDismiss: fn(),
    },
    decorators: [
        (Story) => (
            <div className="w-[500px] p-4">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof FeedItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContentUploaded: Story = {
    args: {
        item: baseActivity,
    },
};

export const DiaryCreated: Story = {
    args: {
        item: {
            ...baseActivity,
            id: 'act-2',
            activityType: 'diary_created',
            title: 'Reflecting on a wonderful week',
            description: 'So grateful for the time spent with family...',
            subjectType: 'diary',
            metadata: { moodEmoji: '\u{1F60A}' },
            createdAt: hoursAgo(5),
        },
    },
};

export const CapsuleCreated: Story = {
    args: {
        item: {
            ...baseActivity,
            id: 'act-3',
            activityType: 'capsule_created',
            title: 'Time capsule for Lily\'s 18th birthday',
            description: 'Locked until June 2037',
            subjectType: 'capsule',
            metadata: { emoji: '\u{1F389}' },
            userDisplayName: 'Marcus Chen',
            createdAt: hoursAgo(24),
        },
    },
};

export const LessonCreated: Story = {
    args: {
        item: {
            ...baseActivity,
            id: 'act-4',
            activityType: 'lesson_created',
            title: 'Always take time to be present',
            subjectType: 'lesson',
            metadata: {},
            createdAt: hoursAgo(48),
        },
    },
};

export const PersonAdded: Story = {
    args: {
        item: {
            ...baseActivity,
            id: 'act-5',
            activityType: 'person_added',
            title: 'Added Grandma Rose',
            description: 'Grandmother',
            subjectType: 'person',
            metadata: {},
            createdAt: hoursAgo(72),
        },
    },
};

export const ContentDeleted: Story = {
    args: {
        item: {
            ...baseActivity,
            id: 'act-6',
            activityType: 'content_deleted',
            title: 'Removed duplicate photo',
            subjectType: 'content',
            metadata: {},
            createdAt: now,
        },
    },
};

export const WithAvatar: Story = {
    args: {
        item: {
            ...baseActivity,
            id: 'act-7',
            userAvatarUrl: 'https://picsum.photos/id/64/100/100',
        },
    },
};

export const NoThumbnail: Story = {
    args: {
        item: {
            ...baseActivity,
            id: 'act-8',
            activityType: 'health_medication_added',
            title: 'Added medication: Vitamin D',
            subjectType: 'medication',
            metadata: {},
        },
    },
};

export const FeedTimeline: Story = {
    args: { item: baseActivity },
    decorators: [
        () => (
            <div className="w-[500px] space-y-3 p-4">
                <FeedItemCard
                    item={baseActivity}
                    onDismiss={fn()}
                />
                <FeedItemCard
                    item={{
                        ...baseActivity,
                        id: 'act-2',
                        activityType: 'diary_created',
                        title: 'Reflecting on a wonderful week',
                        subjectType: 'diary',
                        metadata: { moodEmoji: '\u{1F60A}' },
                        createdAt: hoursAgo(5),
                    }}
                    onDismiss={fn()}
                />
                <FeedItemCard
                    item={{
                        ...baseActivity,
                        id: 'act-3',
                        activityType: 'person_added',
                        title: 'Added Uncle James',
                        subjectType: 'person',
                        metadata: {},
                        userDisplayName: 'Marcus Chen',
                        createdAt: hoursAgo(12),
                    }}
                    onDismiss={fn()}
                />
                <FeedItemCard
                    item={{
                        ...baseActivity,
                        id: 'act-4',
                        activityType: 'capsule_created',
                        title: 'Time capsule sealed',
                        subjectType: 'capsule',
                        metadata: { emoji: '\u{1F48C}' },
                        createdAt: hoursAgo(36),
                    }}
                    onDismiss={fn()}
                />
            </div>
        ),
    ],
};
