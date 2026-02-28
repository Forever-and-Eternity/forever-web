'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadFile } from '@/lib/api/upload';
import { ContentType } from '@/lib/types/enums';
import { toast } from 'sonner';

function getContentType(mimeType: string): ContentType {
    if (mimeType.startsWith('image/')) return ContentType.Photo;
    if (mimeType.startsWith('video/')) return ContentType.Video;
    if (mimeType.startsWith('audio/')) return ContentType.Audio;
    return ContentType.Document;
}

export function UploadDropzone({ havenId }: { havenId: string }) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    }, []);

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        try {
            await uploadFile(havenId, file, getContentType(file.type), {
                title: title || undefined,
                description: description || undefined,
            });
            toast.success('Upload complete');
            router.push(`/havens/${havenId}/content`);
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    }

    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>Upload Content</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div
                        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                            dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                        }`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                    >
                        {file ? (
                            <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => setFile(null)}>
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <p className="text-muted-foreground">Drag and drop a file here, or</p>
                                <Label htmlFor="fileInput" className="mt-2 inline-block cursor-pointer text-primary hover:underline">
                                    browse files
                                </Label>
                                <Input
                                    id="fileInput"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title (optional)</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={300} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="desc">Description (optional)</Label>
                        <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={!file || uploading}>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
