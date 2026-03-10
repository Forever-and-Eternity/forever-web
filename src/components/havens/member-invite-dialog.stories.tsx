import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MemberInviteDialog } from './member-invite-dialog';

const meta = {
    title: 'Havens/MemberInviteDialog',
    component: MemberInviteDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="p-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof MemberInviteDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        havenId: 'haven-1',
    },
};
