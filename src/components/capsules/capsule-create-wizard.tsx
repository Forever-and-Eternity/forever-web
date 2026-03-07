'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { capsulesApi } from '@/lib/api/capsules';
import { Package, ChevronRight, ChevronLeft, Lock, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TRIGGER_TYPES = [
    { value: 'date', label: 'Specific Date', icon: Calendar, description: 'Unlock on a specific date' },
    { value: 'event', label: 'Life Event', icon: Sparkles, description: 'Unlock on a milestone' },
    { value: 'custom', label: 'Custom Event', icon: Lock, description: 'Manually unlock later' },
];

const LIFE_EVENTS = [
    '18th_birthday', 'graduation', 'wedding', 'first_child',
    '21st_birthday', '30th_birthday', '50th_birthday', 'retirement',
];

interface CapsuleCreateWizardProps {
    havenId: string;
}

export function CapsuleCreateWizard({ havenId }: CapsuleCreateWizardProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1: Details
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [emoji, setEmoji] = useState('');

    // Step 2: Lock condition
    const [triggerType, setTriggerType] = useState('date');
    const [unlockAt, setUnlockAt] = useState('');
    const [lifeEvent, setLifeEvent] = useState('');
    const [customEvent, setCustomEvent] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await capsulesApi.create(havenId, {
                title,
                description: description || undefined,
                emoji: emoji || undefined,
                triggerType,
                unlockAt: triggerType === 'date' && unlockAt ? new Date(unlockAt).toISOString() : undefined,
                lifeEvent: triggerType === 'event' ? lifeEvent : undefined,
                customEvent: triggerType === 'custom' ? customEvent : undefined,
                contentIds: [],
                recipientIds: [],
            });
            toast.success('Capsule created!');
            router.push(`/havens/${havenId}/capsules`);
            router.refresh();
        } catch {
            toast.error('Failed to create capsule');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-4">
            {/* Progress */}
            <div className="flex items-center gap-2 px-2">
                {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-2 flex-1">
                        <div className={cn(
                            'h-2 flex-1 rounded-full transition-colors',
                            s <= step ? 'bg-primary' : 'bg-muted'
                        )} />
                    </div>
                ))}
            </div>

            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Package className="h-4 w-4 text-primary" />
                            Capsule Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                placeholder="e.g. Emma's 18th Birthday"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description (optional)</Label>
                            <Textarea
                                placeholder="What's this capsule about?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[80px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Emoji (optional)</Label>
                            <Input
                                placeholder=""
                                value={emoji}
                                onChange={(e) => setEmoji(e.target.value)}
                                className="w-20"
                                maxLength={4}
                            />
                        </div>
                        <Button
                            className="w-full"
                            onClick={() => setStep(2)}
                            disabled={!title.trim()}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Lock className="h-4 w-4 text-primary" />
                            Lock Condition
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            {TRIGGER_TYPES.map((tt) => {
                                const Icon = tt.icon;
                                return (
                                    <button
                                        key={tt.value}
                                        type="button"
                                        onClick={() => setTriggerType(tt.value)}
                                        className={cn(
                                            'w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                                            triggerType === tt.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:bg-accent'
                                        )}
                                    >
                                        <Icon className={cn('h-5 w-5 shrink-0', triggerType === tt.value ? 'text-primary' : 'text-muted-foreground')} />
                                        <div>
                                            <p className="text-sm font-medium">{tt.label}</p>
                                            <p className="text-xs text-muted-foreground">{tt.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {triggerType === 'date' && (
                            <div className="space-y-2">
                                <Label>Unlock Date</Label>
                                <Input
                                    type="datetime-local"
                                    value={unlockAt}
                                    onChange={(e) => setUnlockAt(e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                            </div>
                        )}

                        {triggerType === 'event' && (
                            <div className="space-y-2">
                                <Label>Life Event</Label>
                                <div className="flex flex-wrap gap-2">
                                    {LIFE_EVENTS.map((event) => (
                                        <button
                                            key={event}
                                            type="button"
                                            onClick={() => setLifeEvent(event)}
                                            className={cn(
                                                'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors capitalize',
                                                lifeEvent === event
                                                    ? 'bg-primary/15 border-primary text-primary'
                                                    : 'border-border text-muted-foreground hover:bg-accent'
                                            )}
                                        >
                                            {event.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {triggerType === 'custom' && (
                            <div className="space-y-2">
                                <Label>Event Description</Label>
                                <Input
                                    placeholder="e.g. When they get their first job"
                                    value={customEvent}
                                    onChange={(e) => setCustomEvent(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Back
                            </Button>
                            <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Creating...' : 'Create Capsule'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
