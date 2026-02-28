'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { annotationsApi } from '@/lib/api/annotations';
import { AnnotationType, AnnotationTypeLabels } from '@/lib/types/enums';
import { toast } from 'sonner';

export function AnnotationForm({ contentId, onCreated }: { contentId: string; onCreated?: () => void }) {
    const [body, setBody] = useState('');
    const [type, setType] = useState<string>(String(AnnotationType.MemoryNote));
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!body.trim()) return;

        setLoading(true);
        try {
            await annotationsApi.create(contentId, {
                body,
                annotationType: Number(type) as AnnotationType,
            });
            setBody('');
            toast.success('Annotation added');
            onCreated?.();
        } catch {
            toast.error('Failed to add annotation');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
                placeholder="Add a memory note, story, or context..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={5000}
                rows={3}
            />
            <div className="flex items-center gap-2">
                <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(AnnotationTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button type="submit" size="sm" disabled={loading || !body.trim()}>
                    {loading ? 'Adding...' : 'Add'}
                </Button>
            </div>
        </form>
    );
}
