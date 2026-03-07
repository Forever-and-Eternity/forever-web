import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useHavenStore } from '@/lib/stores/haven-store';
import type { Haven } from '@/lib/types/haven';
import type { UserProfile } from '@/lib/types/auth';
import { Sidebar } from './sidebar';

const mockUser: UserProfile = {
    id: 'user-1',
    email: 'jane@example.com',
    displayName: 'Jane Doe',
    createdAt: '2024-01-01T00:00:00Z',
    preferences: {
        theme: 'system',
        locale: 'en',
        compactMode: false,
        contentLayout: 'grid',
        showAnnotationsInFeed: true,
        emailNotifications: true,
        colorPalette: 'lavender',
        fontFamily: 'nunito',
    },
};

const mockHavens: Haven[] = [
    {
        id: 'haven-1',
        name: 'Family Memories',
        description: 'Our favorite family moments',
        ownerId: 'user-1',
        ownerDisplayName: 'Jane Doe',
        memberCount: 5,
        contentCount: 128,
        createdAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 'haven-2',
        name: 'Summer Trip 2024',
        description: 'Beach vacation photos',
        ownerId: 'user-1',
        ownerDisplayName: 'Jane Doe',
        memberCount: 3,
        contentCount: 45,
        createdAt: '2024-06-15T00:00:00Z',
    },
    {
        id: 'haven-3',
        name: 'Grandma\'s Recipes',
        description: 'Traditional family recipes',
        ownerId: 'user-1',
        ownerDisplayName: 'Jane Doe',
        memberCount: 8,
        contentCount: 32,
        createdAt: '2024-03-10T00:00:00Z',
    },
];

function StoreProvider({ user, havens, children }: { user: UserProfile; havens: Haven[]; children: React.ReactNode }) {
    const setAuth = useAuthStore((s) => s.setAuth);
    const setHavens = useHavenStore((s) => s.setHavens);

    useEffect(() => {
        setAuth(user, 'mock-token', 'mock-refresh');
        setHavens(havens);
    }, [user, havens, setAuth, setHavens]);

    return <>{children}</>;
}

const meta: Meta<typeof Sidebar> = {
    title: 'Layout/Sidebar',
    component: Sidebar,
    parameters: {
        layout: 'fullscreen',
        nextjs: { appDirectory: true, navigation: { pathname: '/havens' } },
    },
    decorators: [
        (Story) => (
            <StoreProvider user={mockUser} havens={mockHavens}>
                <div className="h-screen w-[260px]">
                    <Story />
                </div>
            </StoreProvider>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};

export const ActiveHaven: Story = {
    parameters: {
        nextjs: { appDirectory: true, navigation: { pathname: '/havens/haven-1' } },
    },
};

export const EmptyHavens: Story = {
    decorators: [
        (Story) => (
            <StoreProvider user={mockUser} havens={[]}>
                <div className="h-screen w-[260px]">
                    <Story />
                </div>
            </StoreProvider>
        ),
    ],
};
