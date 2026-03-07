'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import type { Allergy } from '@/lib/types/health';
import { AlertTriangle, Plus } from 'lucide-react';
import { toast } from 'sonner';

const SEVERITY_COLORS: Record<string, string> = {
    mild: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    moderate: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    severe: 'bg-red-500/10 text-red-700 dark:text-red-400',
    life_threatening: 'bg-red-700/10 text-red-800 dark:text-red-300',
};

export function AllergyList({ havenId }: { havenId: string }) {
    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [severity, setSeverity] = useState('moderate');
    const [reaction, setReaction] = useState('');

    const load = useCallback(() => {
        healthApi
            .getAllergies(havenId)
            .then(({ data: res }) => {
                if (res.success && res.data) setAllergies(res.data);
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
            await healthApi.createAllergy(havenId, {
                name,
                severity,
                reaction: reaction || undefined,
            });
            toast.success('Allergy added');
            setOpen(false);
            setName('');
            setReaction('');
            load();
        } catch {
            toast.error('Failed to add allergy');
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary">
                    Allergies
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
                            <SheetTitle>Add Allergy</SheetTitle>
                        </SheetHeader>
                        <form onSubmit={handleAdd} className="space-y-4 mt-4 px-4">
                            <div className="space-y-2">
                                <Label>Allergen</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Severity</Label>
                                <Select value={severity} onValueChange={setSeverity}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['mild', 'moderate', 'severe', 'life_threatening'].map(
                                            (s) => (
                                                <SelectItem
                                                    key={s}
                                                    value={s}
                                                    className="capitalize"
                                                >
                                                    {s.replace(/_/g, ' ')}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Reaction</Label>
                                <Input
                                    placeholder="e.g. Hives, swelling"
                                    value={reaction}
                                    onChange={(e) => setReaction(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={!name.trim()}>
                                Add Allergy
                            </Button>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>
            {!loading && allergies.length === 0 && (
                <p className="text-sm text-muted-foreground">No allergies recorded.</p>
            )}
            {allergies.map((allergy) => (
                <Card key={allergy.id}>
                    <CardContent className="py-3 flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{allergy.name}</p>
                            {allergy.reaction && (
                                <p className="text-xs text-muted-foreground">{allergy.reaction}</p>
                            )}
                        </div>
                        {allergy.severity && (
                            <Badge
                                className={`text-xs capitalize ${SEVERITY_COLORS[allergy.severity] || ''}`}
                            >
                                {allergy.severity.replace(/_/g, ' ')}
                            </Badge>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
