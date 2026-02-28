'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { UserPreferences } from '@/lib/types/auth';
import { toast } from 'sonner';

export function SettingsForm() {
    const { user, setUser } = useAuthStore();
    const { setTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    // Profile fields
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

    // Preferences
    const [preferences, setPreferences] = useState<UserPreferences>({
        theme: 'system',
        locale: 'en',
        compactMode: false,
        contentLayout: 'grid',
        showAnnotationsInFeed: true,
        emailNotifications: true,
    });

    useEffect(() => {
        authApi.getPreferences().then(({ data: res }) => {
            if (res.success && res.data) {
                setPreferences({
                    theme: res.data.theme || 'system',
                    locale: res.data.locale || 'en',
                    compactMode: res.data.compactMode ?? false,
                    contentLayout: res.data.contentLayout || 'grid',
                    showAnnotationsInFeed: res.data.showAnnotationsInFeed ?? true,
                    emailNotifications: res.data.emailNotifications ?? true,
                });
            }
        });
    }, []);

    async function handleProfileSave() {
        setProfileLoading(true);
        try {
            const { data: res } = await authApi.updateProfile({
                displayName: displayName || undefined,
                avatarUrl: avatarUrl || undefined,
            });
            if (res.success && res.data) {
                setUser(res.data);
                toast.success('Profile updated');
            } else {
                toast.error(res.errors?.[0] || 'Failed to update profile');
            }
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setProfileLoading(false);
        }
    }

    async function handlePreferencesSave() {
        setLoading(true);
        try {
            const { data: res } = await authApi.updatePreferences(preferences);
            if (res.success && res.data) {
                setPreferences(res.data);
                // Apply theme immediately
                setTheme(res.data.theme || 'system');
                toast.success('Preferences saved');
            } else {
                toast.error(res.errors?.[0] || 'Failed to save preferences');
            }
        } catch {
            toast.error('Failed to save preferences');
        } finally {
            setLoading(false);
        }
    }

    function updatePref<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
        setPreferences((prev) => ({ ...prev, [key]: value }));
    }

    return (
        <div className="max-w-2xl space-y-6">
            {/* Profile Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Manage your personal information and avatar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                            <AvatarFallback className="text-lg">{displayName?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{user?.email}</p>
                            <p className="text-xs text-muted-foreground">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '...'}</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="avatarUrl">Avatar URL</Label>
                        <Input
                            id="avatarUrl"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                        />
                        <p className="text-xs text-muted-foreground">Enter a URL for your profile picture</p>
                    </div>
                    <Button onClick={handleProfileSave} disabled={profileLoading}>
                        {profileLoading ? 'Saving...' : 'Save Profile'}
                    </Button>
                </CardContent>
            </Card>

            {/* Appearance Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize how Forever looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Theme</Label>
                            <p className="text-xs text-muted-foreground">Choose your preferred color scheme</p>
                        </div>
                        <Select value={preferences.theme} onValueChange={(v) => updatePref('theme', v)}>
                            <SelectTrigger className="w-36">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="system">System</SelectItem>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Content Layout</Label>
                            <p className="text-xs text-muted-foreground">Default layout for content galleries</p>
                        </div>
                        <Select value={preferences.contentLayout} onValueChange={(v) => updatePref('contentLayout', v)}>
                            <SelectTrigger className="w-36">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="grid">Grid</SelectItem>
                                <SelectItem value="list">List</SelectItem>
                                <SelectItem value="masonry">Masonry</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="compactMode">Compact Mode</Label>
                            <p className="text-xs text-muted-foreground">Use less spacing for a denser layout</p>
                        </div>
                        <Switch id="compactMode" checked={preferences.compactMode} onCheckedChange={(v) => updatePref('compactMode', v)} />
                    </div>
                </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Control how you receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="emailNotifications">Email Notifications</Label>
                            <p className="text-xs text-muted-foreground">Receive email updates about haven activity</p>
                        </div>
                        <Switch
                            id="emailNotifications"
                            checked={preferences.emailNotifications}
                            onCheckedChange={(v) => updatePref('emailNotifications', v)}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="showAnnotationsInFeed">Show Annotations in Feed</Label>
                            <p className="text-xs text-muted-foreground">Display comments and stories in the activity feed</p>
                        </div>
                        <Switch
                            id="showAnnotationsInFeed"
                            checked={preferences.showAnnotationsInFeed}
                            onCheckedChange={(v) => updatePref('showAnnotationsInFeed', v)}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handlePreferencesSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
            </div>
        </div>
    );
}
