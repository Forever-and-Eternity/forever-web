'use client';

import { cn } from '@/lib/utils';

const MOODS = [
    { emoji: '\u{1F60A}', label: 'Happy', value: 'happy' },
    { emoji: '\u{1F60C}', label: 'Calm', value: 'calm' },
    { emoji: '\u{1F970}', label: 'Loved', value: 'loved' },
    { emoji: '\u{1F614}', label: 'Sad', value: 'sad' },
    { emoji: '\u{1F624}', label: 'Frustrated', value: 'frustrated' },
    { emoji: '\u{1F630}', label: 'Anxious', value: 'anxious' },
    { emoji: '\u{1F914}', label: 'Reflective', value: 'reflective' },
    { emoji: '\u{1F634}', label: 'Tired', value: 'tired' },
    { emoji: '\u{1F973}', label: 'Excited', value: 'excited' },
    { emoji: '\u{1F622}', label: 'Emotional', value: 'emotional' },
];

interface MoodSelectorProps {
    value?: string;
    onChange: (mood: string, emoji: string) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {MOODS.map((mood) => (
                <button
                    key={mood.value}
                    type="button"
                    onClick={() => onChange(mood.value, mood.emoji)}
                    className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors border',
                        value === mood.value
                            ? 'bg-primary/15 border-primary text-primary'
                            : 'border-border text-muted-foreground hover:bg-accent',
                    )}
                >
                    <span className="text-base">{mood.emoji}</span>
                    <span className="hidden sm:inline text-xs">{mood.label}</span>
                </button>
            ))}
        </div>
    );
}
