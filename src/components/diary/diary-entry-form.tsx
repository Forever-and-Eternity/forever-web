'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodSelector } from './mood-selector';
import { diaryApi } from '@/lib/api/diary';
import type { DiaryEntry } from '@/lib/types/diary';
import { BookOpen, MapPin, Tag, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface DiaryEntryFormProps {
    havenId: string;
    entry?: DiaryEntry;
}

export function DiaryEntryForm({ havenId, entry }: DiaryEntryFormProps) {
    const router = useRouter();
    const [body, setBody] = useState(entry?.body || '');
    const [mood, setMood] = useState(entry?.mood || '');
    const [moodEmoji, setMoodEmoji] = useState(entry?.moodEmoji || '');
    const [locationName, setLocationName] = useState(entry?.locationName || '');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>(entry?.tags || []);
    const [isPrivate, setIsPrivate] = useState(entry?.isPrivate || false);
    const [loading, setLoading] = useState(false);

    const handleAddTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!body.trim()) return;
        setLoading(true);

        try {
            const data = {
                body,
                mood: mood || undefined,
                moodEmoji: moodEmoji || undefined,
                locationName: locationName || undefined,
                tags,
                contentIds: [],
                isPrivate,
            };

            if (entry) {
                await diaryApi.update(havenId, entry.id, data);
                toast.success('Entry updated');
            } else {
                await diaryApi.create(havenId, data);
                toast.success('Entry created');
            }
            router.push(`/havens/${havenId}/journals`);
            router.refresh();
        } catch {
            toast.error('Failed to save entry');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        {entry ? 'Edit Entry' : "What's on your mind?"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Mood */}
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                            How are you feeling?
                        </Label>
                        <MoodSelector
                            value={mood}
                            onChange={(m, e) => {
                                setMood(m);
                                setMoodEmoji(e);
                            }}
                        />
                    </div>

                    {/* Body */}
                    <Textarea
                        placeholder="Write your thoughts..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="min-h-[150px] resize-y"
                        required
                    />

                    {/* Location */}
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <Input
                            placeholder="Add location (optional)"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            className="h-9"
                        />
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
                                        onClick={() => handleRemoveTag(tag)}
                                    >
                                        {tag} &times;
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Private toggle */}
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Private entry</p>
                                <p className="text-xs text-muted-foreground">Only you can see this</p>
                            </div>
                        </div>
                        <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading || !body.trim()}>
                    {loading ? 'Saving...' : entry ? 'Update' : 'Save Entry'}
                </Button>
            </div>
        </form>
    );
}
