'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Camera, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageCropDialog } from '@/components/settings/avatar-crop-dialog';
import { havensApi } from '@/lib/api/havens';
import { useHavenStore } from '@/lib/stores/haven-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';

export default function HavenDetailPage() {
    const params = useParams();
    const havenId = params.havenId as string;
    const haven = useHavenStore((s) => s.currentHaven);
    const updateHaven = useHavenStore((s) => s.updateHaven);
    const user = useAuthStore((s) => s.user);

    const [coverUploading, setCoverUploading] = useState(false);
    const [cropFile, setCropFile] = useState<File | null>(null);
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!haven || haven.id !== havenId) return <Skeleton className="h-64 rounded-lg" />;

    const isOwner = user?.id === haven.ownerId;

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

    async function handleCropComplete(blob: Blob) {
        setCropDialogOpen(false);
        setCropFile(null);
        setCoverUploading(true);
        try {
            const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' });
            const updatedHaven = await havensApi.uploadCover(havenId, file);
            if (updatedHaven) {
                updateHaven(havenId, updatedHaven);
                toast.success('Cover image updated');
            } else {
                toast.error('Failed to upload cover image');
            }
        } catch {
            toast.error('Failed to upload cover image');
        } finally {
            setCoverUploading(false);
        }
    }

    function handleCropCancel() {
        setCropDialogOpen(false);
        setCropFile(null);
    }

    const links = [
        { label: 'Content', href: `/havens/${havenId}/content`, count: haven.contentCount },
        { label: 'People', href: `/havens/${havenId}/people`, count: haven.peopleCount },
        { label: 'Feed', href: `/havens/${havenId}/feed`, count: null },
        { label: 'Members', href: `/havens/${havenId}/members`, count: haven.memberCount },
    ];

    return (
        <div>
            {/* Cover banner */}
            <div className="relative mb-6 h-40 sm:h-52 w-full overflow-hidden rounded-xl bg-gradient-ig">
                {haven.coverImageUrl ? (
                    <img
                        src={haven.coverImageUrl}
                        alt={`${haven.name} cover`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <span className="text-4xl font-bold text-white/80">{haven.name}</span>
                    </div>
                )}
                {isOwner && (
                    <>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={coverUploading}
                            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-opacity hover:bg-black/70"
                        >
                            {coverUploading ? (
                                <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                                <Camera className="size-3.5" />
                            )}
                            {haven.coverImageUrl ? 'Change cover' : 'Add cover'}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelected}
                        />
                    </>
                )}
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold">{haven.name}</h2>
                {haven.description && <p className="mt-1 text-muted-foreground">{haven.description}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-stagger">
                {links.map(({ label, href, count }) => (
                    <Link key={label} href={href}>
                        <Card className="transition-shadow hover:shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {count !== null && <p className="text-2xl font-bold">{count}</p>}
                                <Button variant="link" className="mt-1 h-auto p-0 text-sm">
                                    View {label.toLowerCase()}
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

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
        </div>
    );
}
