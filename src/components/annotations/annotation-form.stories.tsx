import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { AnnotationForm } from './annotation-form';

const meta = {
    title: 'Annotations/AnnotationForm',
    component: AnnotationForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="w-[500px] p-4">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof AnnotationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        contentId: 'content-1',
        onCreated: fn(),
    },
};
