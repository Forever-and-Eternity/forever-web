'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { healthApi } from '@/lib/api/health';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const BODY_REGIONS = [
    'head',
    'chest',
    'abdomen',
    'left_arm',
    'right_arm',
    'left_leg',
    'right_leg',
    'back',
    'general',
];
const SEVERITIES = ['mild', 'moderate', 'severe'];
const STATUSES = ['active', 'resolved', 'chronic'];

interface ConditionFormProps {
    havenId: string;
    defaultRegion?: string;
    onCreated: () => void;
}

export function ConditionForm({ havenId, defaultRegion, onCreated }: ConditionFormProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [bodyRegion, setBodyRegion] = useState(defaultRegion || 'general');
    const [severity, setSeverity] = useState('moderate');
    const [status, setStatus] = useState('active');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        try {
            await healthApi.createCondition(havenId, {
                name,
                bodyRegion,
                severity,
                status,
                notes: notes || undefined,
            });
            toast.success('Condition added');
            setOpen(false);
            setName('');
            setNotes('');
            onCreated();
        } catch {
            toast.error('Failed to add condition');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Condition
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Medical Condition</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4 px-4">
                    <div className="space-y-2">
                        <Label>Condition Name</Label>
                        <Input
                            placeholder="e.g. Lower back pain"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Body Region</Label>
                        <Select value={bodyRegion} onValueChange={setBodyRegion}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {BODY_REGIONS.map((r) => (
                                    <SelectItem key={r} value={r} className="capitalize">
                                        {r.replace(/_/g, ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Severity</Label>
                            <Select value={severity} onValueChange={setSeverity}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SEVERITIES.map((s) => (
                                        <SelectItem key={s} value={s} className="capitalize">
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUSES.map((s) => (
                                        <SelectItem key={s} value={s} className="capitalize">
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Notes (optional)</Label>
                        <Textarea
                            placeholder="Additional details..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[80px]"
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading || !name.trim()}>
                        {loading ? 'Saving...' : 'Add Condition'}
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
