import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InviteStatus } from '@/lib/types/enums';
import type { Person } from '@/lib/types/people';
import { PersonCard } from './person-card';

const basePerson: Person = {
    id: 'person-1',
    displayName: 'Grandma Rose',
    relationship: 'Grandmother',
    email: 'rose@example.com',
    inviteStatus: InviteStatus.Registered,
    tagCount: 12,
    createdAt: '2025-01-15T10:00:00Z',
};

const meta = {
    title: 'People/PersonCard',
    component: PersonCard,
    parameters: {
        layout: 'centered',
        nextjs: { appDirectory: true },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="w-[400px] p-4">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof PersonCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        person: basePerson,
        havenId: 'haven-1',
    },
};

export const NoRelationship: Story = {
    args: {
        person: {
            ...basePerson,
            id: 'person-2',
            displayName: 'Alex Rivera',
            relationship: undefined,
            tagCount: 3,
        },
        havenId: 'haven-1',
    },
};

export const NoTags: Story = {
    args: {
        person: {
            ...basePerson,
            id: 'person-3',
            displayName: 'Baby Noah',
            relationship: 'Son',
            tagCount: 0,
        },
        havenId: 'haven-1',
    },
};

export const ManyTags: Story = {
    args: {
        person: {
            ...basePerson,
            id: 'person-4',
            displayName: 'Uncle James',
            relationship: 'Uncle',
            tagCount: 47,
        },
        havenId: 'haven-1',
    },
};

export const PeopleList: Story = {
    args: { person: basePerson, havenId: 'haven-1' },
    decorators: [
        () => (
            <div className="w-[500px] space-y-2 p-4">
                <PersonCard person={basePerson} havenId="haven-1" />
                <PersonCard
                    person={{ ...basePerson, id: '2', displayName: 'Uncle James', relationship: 'Uncle', tagCount: 8 }}
                    havenId="haven-1"
                />
                <PersonCard
                    person={{ ...basePerson, id: '3', displayName: 'Lily Chen', relationship: 'Daughter', tagCount: 23 }}
                    havenId="haven-1"
                />
                <PersonCard
                    person={{ ...basePerson, id: '4', displayName: 'Baby Noah', relationship: 'Son', tagCount: 0 }}
                    havenId="haven-1"
                />
            </div>
        ),
    ],
};
