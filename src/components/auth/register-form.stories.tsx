import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RegisterForm } from './register-form';

const meta = {
    title: 'Auth/RegisterForm',
    component: RegisterForm,
    parameters: {
        layout: 'centered',
        nextjs: {
            appDirectory: true,
            navigation: { pathname: '/register' },
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="flex min-h-[600px] items-center justify-center p-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnDarkBackground: Story = {
    decorators: [
        (Story) => (
            <div className="flex min-h-[600px] items-center justify-center bg-gray-950 p-8">
                <Story />
            </div>
        ),
    ],
};
