import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InvitationPreview } from './invitation-preview';

const meta = {
    title: 'Invitations/InvitationPreview',
    component: InvitationPreview,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="w-[450px] p-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof InvitationPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        token: 'demo-token',
    },
};
