import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InviteStatus } from '@/lib/types/enums';
import { PersonForm } from './person-form';

const meta = {
    title: 'People/PersonForm',
    component: PersonForm,
    parameters: {
        layout: 'centered',
        nextjs: {
            appDirectory: true,
            navigation: { pathname: '/havens/haven-1/people/new' },
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="p-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof PersonForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateMode: Story = {
    args: {
        havenId: 'haven-1',
    },
};

export const EditMode: Story = {
    args: {
        havenId: 'haven-1',
        person: {
            id: 'person-1',
            displayName: 'Grandma Rose',
            relationship: 'Grandmother',
            email: 'rose@example.com',
            phone: '+1 555-0123',
            inviteStatus: InviteStatus.Registered,
            tagCount: 12,
            createdAt: '2025-01-15T10:00:00Z',
        },
    },
};
