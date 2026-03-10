import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Features } from './features';

const meta = {
    title: 'Landing/Features',
    component: Features,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Features>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
