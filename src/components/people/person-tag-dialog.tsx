'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { peopleApi } from '@/lib/api/people';
import { toast } from 'sonner';
import type { Person } from '@/lib/types/people';

export function PersonTagDialog({ contentId, havenId, onTagged }: { contentId: string; havenId: string; onTagged?: () => void }) {
    const [open, setOpen] = useState(false);
    const [people, setPeople] = useState<Person[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState('');
    const [newPersonName, setNewPersonName] = useState('');
    const [mode, setMode] = useState<'existing' | 'new'>('existing');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            peopleApi.list(havenId).then(({ data: res }) => {
                if (res.success && res.data) setPeople(res.data);
            });
        }
    }, [open, havenId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await peopleApi.tagContent(contentId, {
                personId: mode === 'existing' ? selectedPersonId : undefined,
                newPersonName: mode === 'new' ? newPersonName : undefined,
            });
            toast.success('Person tagged');
            setOpen(false);
            onTagged?.();
        } catch {
            toast.error('Failed to tag person');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Tag Person
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tag a person in this content</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={mode === 'existing' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setMode('existing')}
                        >
                            Existing Person
                        </Button>
                        <Button type="button" variant={mode === 'new' ? 'default' : 'outline'} size="sm" onClick={() => setMode('new')}>
                            New Person
                        </Button>
                    </div>

                    {mode === 'existing' ? (
                        <div className="space-y-2">
                            <Label>Select Person</Label>
                            <Select value={selectedPersonId} onValueChange={setSelectedPersonId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a person" />
                                </SelectTrigger>
                                <SelectContent>
                                    {people.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.displayName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="newName">Person Name</Label>
                            <Input id="newName" value={newPersonName} onChange={(e) => setNewPersonName(e.target.value)} required />
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || (mode === 'existing' && !selectedPersonId) || (mode === 'new' && !newPersonName)}
                    >
                        {loading ? 'Tagging...' : 'Tag Person'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
