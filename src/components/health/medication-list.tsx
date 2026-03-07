'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { healthApi } from '@/lib/api/health';
import type { MedicationItem } from '@/lib/types/health';
import { Pill, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function MedicationList({ havenId }: { havenId: string }) {
    const [meds, setMeds] = useState<MedicationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');

    const load = useCallback(() => {
        healthApi
            .getMedications(havenId, true)
            .then(({ data: res }) => {
                if (res.success && res.data) setMeds(res.data);
            })
            .finally(() => setLoading(false));
    }, [havenId]);

    useEffect(() => {
        load();
    }, [load]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            await healthApi.createMedication(havenId, {
                name,
                dosage: dosage || undefined,
                frequency: frequency || undefined,
                isCurrent: true,
            });
            toast.success('Medication added');
            setOpen(false);
            setName('');
            setDosage('');
            setFrequency('');
            load();
        } catch {
            toast.error('Failed to add medication');
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary">
                    Medications
                </h3>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button size="sm" variant="ghost">
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add Medication</SheetTitle>
                        </SheetHeader>
                        <form onSubmit={handleAdd} className="space-y-4 mt-4 px-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Dosage</Label>
                                <Input
                                    placeholder="e.g. 500mg"
                                    value={dosage}
                                    onChange={(e) => setDosage(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Frequency</Label>
                                <Input
                                    placeholder="e.g. Twice daily"
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={!name.trim()}>
                                Add Medication
                            </Button>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>
            {!loading && meds.length === 0 && (
                <p className="text-sm text-muted-foreground">No current medications.</p>
            )}
            {meds.map((med) => (
                <Card key={med.id}>
                    <CardContent className="py-3 flex items-center gap-3">
                        <Pill className="h-4 w-4 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{med.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {[med.dosage, med.frequency].filter(Boolean).join(' — ') ||
                                    'No details'}
                            </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            Current
                        </Badge>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
