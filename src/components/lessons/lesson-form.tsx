'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { lessonsApi } from '@/lib/api/lessons';
import type { Lesson } from '@/lib/types/lesson';
import { GraduationCap, Tag } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
    'relationships', 'career', 'health', 'finances',
    'parenting', 'life', 'spirituality', 'education',
];

const AGE_OPTIONS = [
    'childhood', 'teenage', 'twenties', 'thirties',
    'parenthood', 'retirement', 'all',
];

interface LessonFormProps {
    havenId: string;
    lesson?: Lesson;
}

export function LessonForm({ havenId, lesson }: LessonFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(lesson?.title || '');
    const [body, setBody] = useState(lesson?.body || '');
    const [category, setCategory] = useState(lesson?.category || 'life');
    const [ageRelevant, setAgeRelevant] = useState(lesson?.ageRelevant || 'all');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>(lesson?.tags || []);
    const [loading, setLoading] = useState(false);

    const handleAddTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setTagInput('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;
        setLoading(true);

        try {
            const data = { title, body, category, ageRelevant, tags };
            if (lesson) {
                await lessonsApi.update(havenId, lesson.id, data);
                toast.success('Lesson updated');
            } else {
                await lessonsApi.create(havenId, data);
                toast.success('Lesson created');
            }
            router.push(`/havens/${havenId}/lessons`);
            router.refresh();
        } catch {
            toast.error('Failed to save lesson');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        {lesson ? 'Edit Lesson' : 'Share a Life Lesson'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            placeholder="e.g. Always save before you spend"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Lesson</Label>
                        <Textarea
                            placeholder="Share your wisdom..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="min-h-[120px] resize-y"
                            required
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat} className="capitalize">
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Age Relevance</Label>
                            <Select value={ageRelevant} onValueChange={setAgeRelevant}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {AGE_OPTIONS.map((age) => (
                                        <SelectItem key={age} value={age} className="capitalize">
                                            {age}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                            <Input
                                placeholder="Add a tag and press Enter"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                className="h-9"
                            />
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary cursor-pointer hover:bg-primary/20"
                                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                                    >
                                        {tag} &times;
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading || !title.trim() || !body.trim()}>
                    {loading ? 'Saving...' : lesson ? 'Update' : 'Save Lesson'}
                </Button>
            </div>
        </form>
    );
}
