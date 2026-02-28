'use client';

import { SettingsForm } from '@/components/settings/settings-form';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-muted-foreground">Manage your account, appearance, and notification preferences</p>
            </div>
            <SettingsForm />
        </div>
    );
}
