'use client';

import { cn } from '@/lib/utils';

const AGE_BRACKETS = [
    { value: 'childhood', label: 'Childhood', range: '0-12' },
    { value: 'teenage', label: 'Teenage', range: '13-19' },
    { value: 'twenties', label: 'Twenties', range: '20-29' },
    { value: 'thirties', label: 'Thirties', range: '30-39' },
    { value: 'parenthood', label: 'Parenthood', range: '' },
    { value: 'retirement', label: 'Retirement', range: '60+' },
    { value: 'all', label: 'All Ages', range: '' },
];

interface AgeTimelineProps {
    selected?: string;
    onSelect: (value: string | undefined) => void;
}

export function AgeTimeline({ selected, onSelect }: AgeTimelineProps) {
    return (
        <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            <button
                type="button"
                onClick={() => onSelect(undefined)}
                className={cn(
                    'shrink-0 snap-start rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                    !selected
                        ? 'bg-primary/15 border-primary text-primary'
                        : 'border-border text-muted-foreground hover:bg-accent'
                )}
            >
                All
            </button>
            {AGE_BRACKETS.map((bracket) => (
                <button
                    key={bracket.value}
                    type="button"
                    onClick={() => onSelect(selected === bracket.value ? undefined : bracket.value)}
                    className={cn(
                        'shrink-0 snap-start rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                        selected === bracket.value
                            ? 'bg-primary/15 border-primary text-primary'
                            : 'border-border text-muted-foreground hover:bg-accent'
                    )}
                >
                    {bracket.label}
                </button>
            ))}
        </div>
    );
}
