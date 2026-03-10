import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AcceptForm } from './accept-form';

const meta = {
    title: 'Invitations/AcceptForm',
    component: AcceptForm,
    parameters: {
        layout: 'centered',
        nextjs: {
            appDirectory: true,
            navigation: { pathname: '/invitations/demo-token' },
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="w-[450px] p-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof AcceptForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        token: 'demo-token',
    },
};
