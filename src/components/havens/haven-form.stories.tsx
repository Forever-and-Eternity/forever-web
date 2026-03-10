import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HavenForm } from './haven-form';

const meta = {
    title: 'Havens/HavenForm',
    component: HavenForm,
    parameters: {
        layout: 'centered',
        nextjs: {
            appDirectory: true,
            navigation: { pathname: '/havens/new' },
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
} satisfies Meta<typeof HavenForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
