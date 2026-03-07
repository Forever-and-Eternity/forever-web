'use client';

import { cn } from '@/lib/utils';
import type { BodyMapRegion } from '@/lib/types/health';

interface BodyMapSvgProps {
    regions: BodyMapRegion[];
    selectedRegion?: string;
    onSelectRegion: (region: string) => void;
}

const BODY_REGIONS = [
    { id: 'head', label: 'Head', cx: 100, cy: 35, rx: 22, ry: 25 },
    { id: 'chest', label: 'Chest', cx: 100, cy: 100, rx: 35, ry: 30 },
    { id: 'abdomen', label: 'Abdomen', cx: 100, cy: 155, rx: 30, ry: 25 },
    { id: 'left_arm', label: 'Left Arm', cx: 52, cy: 120, rx: 12, ry: 45 },
    { id: 'right_arm', label: 'Right Arm', cx: 148, cy: 120, rx: 12, ry: 45 },
    { id: 'left_leg', label: 'Left Leg', cx: 82, cy: 235, rx: 14, ry: 55 },
    { id: 'right_leg', label: 'Right Leg', cx: 118, cy: 235, rx: 14, ry: 55 },
];

const EXTRA_BUTTONS = [
    { id: 'back', label: 'Back' },
    { id: 'general', label: 'General' },
];

export function BodyMapSvg({ regions, selectedRegion, onSelectRegion }: BodyMapSvgProps) {
    const regionMap = new Map(regions.map((r) => [r.bodyRegion, r.conditionCount]));

    return (
        <div className="flex flex-col items-center gap-4">
            <svg viewBox="0 0 200 310" className="w-full max-w-[200px] h-auto">
                {/* Body outline */}
                <g>
                    {/* Neck */}
                    <rect
                        x="92"
                        y="57"
                        width="16"
                        height="15"
                        rx="4"
                        className="fill-muted stroke-border"
                        strokeWidth="1"
                    />

                    {BODY_REGIONS.map((region) => {
                        const count = regionMap.get(region.id) || 0;
                        const isSelected = selectedRegion === region.id;
                        const hasData = count > 0;

                        return (
                            <g key={region.id}>
                                <ellipse
                                    cx={region.cx}
                                    cy={region.cy}
                                    rx={region.rx}
                                    ry={region.ry}
                                    className={cn(
                                        'cursor-pointer transition-all duration-200 stroke-2',
                                        isSelected
                                            ? 'fill-primary/30 stroke-primary'
                                            : hasData
                                              ? 'fill-primary/15 stroke-primary/60'
                                              : 'fill-muted stroke-border hover:fill-accent'
                                    )}
                                    onClick={() => onSelectRegion(region.id)}
                                />
                                {hasData && (
                                    <text
                                        x={region.cx}
                                        y={region.cy + 4}
                                        textAnchor="middle"
                                        className="text-[10px] font-bold fill-primary pointer-events-none"
                                    >
                                        {count}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </g>
            </svg>

            {/* Region buttons for mobile + back/general */}
            <div className="flex flex-wrap gap-1.5 justify-center">
                {[...BODY_REGIONS, ...EXTRA_BUTTONS].map((region) => {
                    const count = regionMap.get(region.id) || 0;
                    return (
                        <button
                            key={region.id}
                            type="button"
                            onClick={() => onSelectRegion(region.id)}
                            className={cn(
                                'rounded-full px-2.5 py-1 text-xs font-medium border transition-colors',
                                selectedRegion === region.id
                                    ? 'bg-primary/15 border-primary text-primary'
                                    : 'border-border text-muted-foreground hover:bg-accent'
                            )}
                        >
                            {region.label} {count > 0 && `(${count})`}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
