'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import type { MedicalProvider } from '@/lib/types/health';
import { Stethoscope, Plus, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function ProviderList({ havenId }: { havenId: string }) {
    const [providers, setProviders] = useState<MedicalProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const load = useCallback(() => {
        healthApi
            .getProviders(havenId)
            .then(({ data: res }) => {
                if (res.success && res.data) setProviders(res.data);
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
            await healthApi.createProvider(havenId, {
                name,
                specialty: specialty || undefined,
                phone: phone || undefined,
                address: address || undefined,
            });
            toast.success('Provider added');
            setOpen(false);
            setName('');
            setSpecialty('');
            setPhone('');
            setAddress('');
            load();
        } catch {
            toast.error('Failed to add provider');
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary">
                    Providers
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
                            <SheetTitle>Add Provider</SheetTitle>
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
                                <Label>Specialty</Label>
                                <Input
                                    placeholder="e.g. GP, Cardiologist"
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={!name.trim()}>
                                Add Provider
                            </Button>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>
            {!loading && providers.length === 0 && (
                <p className="text-sm text-muted-foreground">No providers recorded.</p>
            )}
            {providers.map((p) => (
                <Card key={p.id}>
                    <CardContent className="py-3 flex items-start gap-3">
                        <Stethoscope className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{p.name}</p>
                            {p.specialty && (
                                <p className="text-xs text-muted-foreground">{p.specialty}</p>
                            )}
                            <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                                {p.phone && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {p.phone}
                                    </span>
                                )}
                                {p.address && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {p.address}
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
