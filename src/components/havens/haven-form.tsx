'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageCropDialog } from '@/components/settings/avatar-crop-dialog';
import { havensApi } from '@/lib/api/havens';
import { useHavenStore } from '@/lib/stores/haven-store';
import { toast } from 'sonner';

export function HavenForm() {
    const router = useRouter();
    const addHaven = useHavenStore((s) => s.addHaven);
    const updateHaven = useHavenStore((s) => s.updateHaven);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Cover image state
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
    const [cropFile, setCropFile] = useState<File | null>(null);
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image must be under 10MB');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setCropFile(file);
        setCropDialogOpen(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function handleCropComplete(blob: Blob) {
        setCropDialogOpen(false);
        setCropFile(null);
        setCoverBlob(blob);
        setCoverPreview(URL.createObjectURL(blob));
    }

    function handleCropCancel() {
        setCropDialogOpen(false);
        setCropFile(null);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data: res } = await havensApi.create({
                name,
                description: description || undefined,
            });
            if (res.success && res.data) {
                addHaven(res.data);

                // Upload cover if selected
                if (coverBlob) {
                    const file = new File([coverBlob], 'cover.jpg', { type: 'image/jpeg' });
                    const updatedHaven = await havensApi.uploadCover(res.data.id, file);
                    if (updatedHaven) {
                        updateHaven(res.data.id, updatedHaven);
                    }
                }

                router.push(`/havens/${res.data.id}`);
            } else {
                setError(res.errors[0] || 'Failed to create haven');
            }
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { errors?: string[] } } };
            setError(axiosErr.response?.data?.errors?.[0] || 'Failed to create haven');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>Create a new Haven</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                    {/* Cover image picker */}
                    <div className="space-y-2">
                        <Label>Cover Image</Label>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/50 transition-colors hover:bg-muted"
                        >
                            {coverPreview ? (
                                <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                    <ImagePlus className="size-8" />
                                    <span className="text-xs">Click to add a cover image</span>
                                </div>
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelected}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Family Memories"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            maxLength={200}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="A place for our family photos and stories..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={1000}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                'Create Haven'
                            )}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>

            <ImageCropDialog
                open={cropDialogOpen}
                imageFile={cropFile}
                onCropComplete={handleCropComplete}
                onCancel={handleCropCancel}
                title="Crop Cover Image"
                cropShape="rect"
                aspect={16 / 9}
                outputWidth={1200}
                outputHeight={675}
            />
        </Card>
    );
}
