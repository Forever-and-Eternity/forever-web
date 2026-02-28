import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LoginForm } from './login-form';

const meta = {
    title: 'Auth/LoginForm',
    component: LoginForm,
    parameters: {
        layout: 'centered',
        nextjs: {
            appDirectory: true,
            navigation: {
                push: (...args: unknown[]) => {
                    console.log('router.push called with:', ...args);
                },
            },
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="flex min-h-[500px] items-center justify-center bg-background p-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnDarkBackground: Story = {
    decorators: [
        (Story) => (
            <div className="dark flex min-h-[500px] items-center justify-center rounded-lg bg-background p-8">
                <Story />
            </div>
        ),
    ],
};
