'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import type { KeychainCategory } from '@/lib/types/keychain';
import { cn } from '@/lib/utils';

interface CategoryGridProps {
    categories: KeychainCategory[];
    selectedId?: string;
    onSelect: (id: string) => void;
    onAdd: () => void;
}

export function CategoryGrid({ categories, selectedId, onSelect, onAdd }: CategoryGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className="text-left"
                >
                    <Card
                        className={cn(
                            'bg-card border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors h-full',
                            selectedId === cat.id && 'ring-2 ring-primary',
                        )}
                    >
                        <CardContent className="p-0 flex flex-col items-center gap-2 text-center">
                            <span className="text-2xl" role="img" aria-label={cat.name}>
                                {cat.icon || cat.name.charAt(0).toUpperCase()}
                            </span>
                            <span className="text-sm font-medium line-clamp-1">
                                {cat.name}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                                {cat.entryCount} {cat.entryCount === 1 ? 'item' : 'items'}
                            </Badge>
                        </CardContent>
                    </Card>
                </button>
            ))}
            <button onClick={onAdd} className="text-left">
                <Card className="bg-card border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors h-full border-dashed">
                    <CardContent className="p-0 flex flex-col items-center justify-center gap-2 text-center min-h-[80px]">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <Plus className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">Add Category</span>
                    </CardContent>
                </Card>
            </button>
        </div>
    );
}
