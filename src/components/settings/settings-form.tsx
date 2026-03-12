'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Camera, Check, Loader2, Monitor, Moon, Sun } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AvatarCropDialog } from '@/components/settings/avatar-crop-dialog';

/* ─── Palette config ─── */
const PALETTES = [
    {
        key: 'lavender',
        label: 'Lavender',
        lightColors: { bg: '#f5f3f8', primary: '#7c3aed', secondary: '#e879a8' },
        darkColors: { bg: '#0d0f1e', primary: '#a78bfa', secondary: '#f0abcb' },
    },
    {
        key: 'sapphire',
        label: 'Sapphire',
        lightColors: { bg: '#f2f5f9', primary: '#2563eb', secondary: '#38bdf8' },
        darkColors: { bg: '#0c1527', primary: '#60a5fa', secondary: '#67e8f9' },
    },
    {
        key: 'rose',
        label: 'Rose',
        lightColors: { bg: '#faf6f4', primary: '#e11d48', secondary: '#f97316' },
        darkColors: { bg: '#0e0f1c', primary: '#fb7185', secondary: '#fdba74' },
    },
    {
        key: 'emerald',
        label: 'Emerald',
        lightColors: { bg: '#f3f6f4', primary: '#0d9488', secondary: '#22c55e' },
        darkColors: { bg: '#0b1219', primary: '#2dd4bf', secondary: '#4ade80' },
    },
    {
        key: 'bubblegum',
        label: 'Bubblegum',
        lightColors: { bg: '#faf4f7', primary: '#ec4899', secondary: '#a855f7' },
        darkColors: { bg: '#120b16', primary: '#f472b6', secondary: '#c084fc' },
    },
] as const;

/* ─── Font config ─── */
const FONTS = [
    { key: 'nunito', label: 'Nunito', category: 'Rounded', cssVar: '--font-nunito' },
    { key: 'plus-jakarta-sans', label: 'Plus Jakarta Sans', category: 'Geometric', cssVar: '--font-plus-jakarta-sans' },
    { key: 'outfit', label: 'Outfit', category: 'Geometric', cssVar: '--font-outfit' },
    { key: 'dm-sans', label: 'DM Sans', category: 'Neutral', cssVar: '--font-dm-sans' },
    { key: 'manrope', label: 'Manrope', category: 'Neutral', cssVar: '--font-manrope' },
    { key: 'sora', label: 'Sora', category: 'Modern', cssVar: '--font-sora' },
    { key: 'space-grotesk', label: 'Space Grotesk', category: 'Sharp', cssVar: '--font-space-grotesk' },
] as const;

const THEME_OPTIONS = [
    { key: 'system', label: 'System', icon: Monitor },
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
] as const;

function applyLivePreview(palette: string, font: string) {
    const root = document.documentElement;
    root.setAttribute('data-palette', palette);
    root.setAttribute('data-font', font);
}

export function SettingsForm() {
    const { user, setUser } = useAuthStore();
    const { theme: currentTheme, resolvedTheme, setTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [cropFile, setCropFile] = useState<File | null>(null);
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const savedRef = useRef(false);
    const initialPrefsRef = useRef<{ palette: string; font: string; theme: string } | null>(null);

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
        colorPalette: 'lavender',
        fontFamily: 'nunito',
        vaultAutoLockSeconds: 60,
    });

    useEffect(() => {
        authApi.getPreferences().then(({ data: res }) => {
            if (res.success && res.data) {
                const prefs = {
                    theme: res.data.theme || 'system',
                    locale: res.data.locale || 'en',
                    compactMode: res.data.compactMode ?? false,
                    contentLayout: res.data.contentLayout || 'grid',
                    showAnnotationsInFeed: res.data.showAnnotationsInFeed ?? true,
                    emailNotifications: res.data.emailNotifications ?? true,
                    colorPalette: res.data.colorPalette || 'lavender',
                    fontFamily: res.data.fontFamily || 'nunito',
                    vaultAutoLockSeconds: res.data.vaultAutoLockSeconds ?? 60,
                };
                setPreferences(prefs);
                initialPrefsRef.current = {
                    palette: prefs.colorPalette,
                    font: prefs.fontFamily,
                    theme: prefs.theme,
                };
            }
        });
    }, []);

    // Revert live preview on unmount if not saved
    useEffect(() => {
        return () => {
            if (!savedRef.current && initialPrefsRef.current) {
                applyLivePreview(initialPrefsRef.current.palette, initialPrefsRef.current.font);
            }
        };
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
                setTheme(res.data.theme || 'system');
                applyLivePreview(res.data.colorPalette || 'lavender', res.data.fontFamily || 'nunito');
                savedRef.current = true;
                initialPrefsRef.current = {
                    palette: res.data.colorPalette || 'lavender',
                    font: res.data.fontFamily || 'nunito',
                    theme: res.data.theme || 'system',
                };

                // Update the user object in the store so main layout picks up new prefs
                if (user) {
                    setUser({ ...user, preferences: res.data });
                }

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

    function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be under 5MB');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setCropFile(file);
        setCropDialogOpen(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    async function handleCropComplete(blob: Blob) {
        setCropDialogOpen(false);
        setCropFile(null);
        setAvatarUploading(true);
        try {
            const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
            const updatedUser = await authApi.uploadAvatar(file);
            if (updatedUser) {
                setUser(updatedUser);
                setAvatarUrl(updatedUser.avatarUrl || '');
                toast.success('Avatar updated');
            } else {
                toast.error('Failed to upload avatar');
            }
        } catch {
            toast.error('Failed to upload avatar');
        } finally {
            setAvatarUploading(false);
        }
    }

    function handleCropCancel() {
        setCropDialogOpen(false);
        setCropFile(null);
    }

    function updatePref<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
        setPreferences((prev) => ({ ...prev, [key]: value }));
    }

    function handleThemeChange(newTheme: string) {
        updatePref('theme', newTheme);
        setTheme(newTheme);
    }

    function handlePaletteChange(newPalette: string) {
        updatePref('colorPalette', newPalette);
        applyLivePreview(newPalette, preferences.fontFamily);
    }

    function handleFontChange(newFont: string) {
        updatePref('fontFamily', newFont);
        applyLivePreview(preferences.colorPalette, newFont);
    }

    const isDark = resolvedTheme === 'dark';

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
                        <button
                            type="button"
                            className="relative group"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={avatarUploading}
                        >
                            <Avatar className="h-16 w-16">
                                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                                <AvatarFallback className="text-lg">{displayName?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                {avatarUploading ? (
                                    <Loader2 className="size-5 text-white animate-spin" />
                                ) : (
                                    <Camera className="size-5 text-white" />
                                )}
                            </div>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelected}
                        />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{user?.email}</p>
                            <p className="text-xs text-muted-foreground">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '...'}</p>
                            <p className="text-xs text-muted-foreground">Click the avatar to upload a new photo</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
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
                <CardContent className="space-y-6">
                    {/* Theme toggle */}
                    <div className="space-y-2">
                        <Label>Theme</Label>
                        <div className="flex gap-2">
                            {THEME_OPTIONS.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => handleThemeChange(key)}
                                    className={cn(
                                        'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                                        preferences.theme === key
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border hover:bg-accent',
                                    )}
                                >
                                    <Icon className="size-4" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Color Palette */}
                    <div className="space-y-3">
                        <Label>Color Palette</Label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {PALETTES.map((palette) => {
                                const colors = isDark ? palette.darkColors : palette.lightColors;
                                const isActive = preferences.colorPalette === palette.key;

                                return (
                                    <button
                                        key={palette.key}
                                        type="button"
                                        onClick={() => handlePaletteChange(palette.key)}
                                        className={cn(
                                            'relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all',
                                            isActive
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-border hover:border-primary/40',
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                <Check className="size-3" />
                                            </div>
                                        )}
                                        {/* Color preview swatch */}
                                        <div
                                            className="flex h-10 w-full items-center justify-center gap-1 rounded-lg"
                                            style={{ backgroundColor: colors.bg }}
                                        >
                                            <div
                                                className="h-6 w-6 rounded-full"
                                                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                                            />
                                            <div className="h-6 w-6 rounded-full" style={{ backgroundColor: colors.primary }} />
                                            <div className="h-6 w-6 rounded-full" style={{ backgroundColor: colors.secondary }} />
                                        </div>
                                        <span className="text-xs font-medium">{palette.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <Separator />

                    {/* Font */}
                    <div className="space-y-3">
                        <Label>Font</Label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {FONTS.map((font) => {
                                const isActive = preferences.fontFamily === font.key;

                                return (
                                    <button
                                        key={font.key}
                                        type="button"
                                        onClick={() => handleFontChange(font.key)}
                                        className={cn(
                                            'relative flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-all',
                                            isActive
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-border hover:border-primary/40',
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                <Check className="size-3" />
                                            </div>
                                        )}
                                        <span
                                            className="text-lg font-semibold leading-tight"
                                            style={{ fontFamily: `var(${font.cssVar}), sans-serif` }}
                                        >
                                            Aa Bb Cc
                                        </span>
                                        <span className="text-xs font-medium">{font.label}</span>
                                        <span className="text-[10px] text-muted-foreground">{font.category}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <Separator />

                    {/* Content Layout + Compact Mode */}
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

            {/* Security Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Configure vault and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Vault Auto-Lock</Label>
                            <p className="text-xs text-muted-foreground">
                                Automatically lock the vault after inactivity
                            </p>
                        </div>
                        <Select
                            value={String(preferences.vaultAutoLockSeconds)}
                            onValueChange={(v) => updatePref('vaultAutoLockSeconds', Number(v))}
                        >
                            <SelectTrigger className="w-36">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10 seconds</SelectItem>
                                <SelectItem value="15">15 seconds</SelectItem>
                                <SelectItem value="20">20 seconds</SelectItem>
                                <SelectItem value="30">30 seconds</SelectItem>
                                <SelectItem value="45">45 seconds</SelectItem>
                                <SelectItem value="60">60 seconds</SelectItem>
                                <SelectItem value="90">90 seconds</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handlePreferencesSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
            </div>

            <AvatarCropDialog
                open={cropDialogOpen}
                imageFile={cropFile}
                onCropComplete={handleCropComplete}
                onCancel={handleCropCancel}
            />
        </div>
    );
}
