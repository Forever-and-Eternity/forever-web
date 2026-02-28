import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heart, Mail, Plus, Trash2 } from 'lucide-react';
import { Button } from './button';

const meta = {
    title: 'UI/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        },
        size: {
            control: 'select',
            options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
        },
        disabled: {
            control: 'boolean',
        },
        asChild: {
            control: 'boolean',
        },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Variants ──

export const Default: Story = {
    args: {
        children: 'Default Button',
        variant: 'default',
    },
};

export const Destructive: Story = {
    args: {
        children: 'Delete',
        variant: 'destructive',
    },
};

export const Outline: Story = {
    args: {
        children: 'Outline',
        variant: 'outline',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary',
        variant: 'secondary',
    },
};

export const Ghost: Story = {
    args: {
        children: 'Ghost',
        variant: 'ghost',
    },
};

export const Link: Story = {
    args: {
        children: 'Link Button',
        variant: 'link',
    },
};

// ── Sizes ──

export const SizeXS: Story = {
    args: {
        children: 'Extra Small',
        size: 'xs',
    },
};

export const SizeSM: Story = {
    args: {
        children: 'Small',
        size: 'sm',
    },
};

export const SizeDefault: Story = {
    args: {
        children: 'Default Size',
        size: 'default',
    },
};

export const SizeLG: Story = {
    args: {
        children: 'Large',
        size: 'lg',
    },
};

// ── Icon Buttons ──

export const IconButton: Story = {
    args: {
        size: 'icon',
        children: <Plus />,
        'aria-label': 'Add',
    },
};

export const IconButtonXS: Story = {
    args: {
        size: 'icon-xs',
        children: <Heart />,
        'aria-label': 'Like',
    },
};

export const IconButtonSM: Story = {
    args: {
        size: 'icon-sm',
        children: <Trash2 />,
        variant: 'destructive',
        'aria-label': 'Delete',
    },
};

export const IconButtonLG: Story = {
    args: {
        size: 'icon-lg',
        children: <Mail />,
        variant: 'outline',
        'aria-label': 'Email',
    },
};

// ── With Icon and Text ──

export const WithIcon: Story = {
    args: {
        children: (
            <>
                <Mail />
                Send Email
            </>
        ),
    },
};

export const DestructiveWithIcon: Story = {
    args: {
        variant: 'destructive',
        children: (
            <>
                <Trash2 />
                Delete Item
            </>
        ),
    },
};

// ── States ──

export const Disabled: Story = {
    args: {
        children: 'Disabled',
        disabled: true,
    },
};

export const DisabledDestructive: Story = {
    args: {
        children: 'Disabled Destructive',
        variant: 'destructive',
        disabled: true,
    },
};

// ── Gallery: All Variants ──

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
        </div>
    ),
};

// ── Gallery: All Sizes ──

export const AllSizes: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-4">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon-xs">
                <Plus />
            </Button>
            <Button size="icon-sm">
                <Plus />
            </Button>
            <Button size="icon">
                <Plus />
            </Button>
            <Button size="icon-lg">
                <Plus />
            </Button>
        </div>
    ),
};
