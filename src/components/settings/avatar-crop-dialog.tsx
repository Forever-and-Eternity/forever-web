'use client';

import { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { Loader2, ZoomIn } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export interface ImageCropDialogProps {
    open: boolean;
    imageFile: File | null;
    onCropComplete: (blob: Blob) => void;
    onCancel: () => void;
    title?: string;
    cropShape?: 'round' | 'rect';
    aspect?: number;
    outputWidth?: number;
    outputHeight?: number;
}

function getCroppedImage(imageSrc: string, pixelCrop: Area, outputWidth: number, outputHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = outputWidth;
            canvas.height = outputHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }
            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                outputWidth,
                outputHeight,
            );
            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Failed to create blob'));
                },
                'image/jpeg',
                0.9,
            );
        };
        image.onerror = () => reject(new Error('Failed to load image'));
        image.src = imageSrc;
    });
}

export function ImageCropDialog({
    open,
    imageFile,
    onCropComplete,
    onCancel,
    title = 'Crop Image',
    cropShape = 'rect',
    aspect = 1,
    outputWidth = 512,
    outputHeight = 512,
}: ImageCropDialogProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!imageFile) {
            setImageSrc(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result as string);
        reader.readAsDataURL(imageFile);
    }, [imageFile]);

    // Reset state when dialog opens
    useEffect(() => {
        if (open) {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);
            setSaving(false);
        }
    }, [open]);

    const onCropAreaChange = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    async function handleSave() {
        if (!imageSrc || !croppedAreaPixels) return;
        setSaving(true);
        try {
            const blob = await getCroppedImage(imageSrc, croppedAreaPixels, outputWidth, outputHeight);
            onCropComplete(blob);
        } catch {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel(); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>Drag to reposition and use the slider to zoom.</DialogDescription>
                </DialogHeader>

                <div className="relative h-56 sm:h-72 w-full overflow-hidden rounded-lg bg-muted touch-none">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            cropShape={cropShape}
                            showGrid={false}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropAreaChange}
                        />
                    )}
                </div>

                <div className="flex items-center gap-3 px-1">
                    <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
                    <Slider
                        value={[zoom]}
                        min={1}
                        max={3}
                        step={0.05}
                        onValueChange={([v]) => setZoom(v)}
                    />
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onCancel} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving || !croppedAreaPixels}>
                        {saving ? (
                            <>
                                <Loader2 className="size-4 animate-spin mr-2" />
                                Saving…
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/** Convenience wrapper for avatar cropping (round, 1:1, 512x512). */
export function AvatarCropDialog(props: Omit<ImageCropDialogProps, 'title' | 'cropShape' | 'aspect' | 'outputWidth' | 'outputHeight'>) {
    return (
        <ImageCropDialog
            {...props}
            title="Crop Avatar"
            cropShape="round"
            aspect={1}
            outputWidth={512}
            outputHeight={512}
        />
    );
}
