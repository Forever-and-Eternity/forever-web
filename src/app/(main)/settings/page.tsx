'use client';

import { SettingsForm } from '@/components/settings/settings-form';

export default function SettingsPage() {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-muted-foreground">Manage your account, appearance, and notification preferences</p>
            </div>
            <SettingsForm />
        </div>
    );
}
