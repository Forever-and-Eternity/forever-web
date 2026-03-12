'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BodyMapSvg } from '@/components/health/body-map-svg';
import { ConditionForm } from '@/components/health/condition-form';
import { MedicationList } from '@/components/health/medication-list';
import { AllergyList } from '@/components/health/allergy-list';
import { ProviderList } from '@/components/health/provider-list';
import { healthApi } from '@/lib/api/health';
import type { BodyMapRegion, MedicalCondition } from '@/lib/types/health';
import { Activity, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HealthPage() {
    const params = useParams();
    const havenId = params.havenId as string;
    const [regions, setRegions] = useState<BodyMapRegion[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string | undefined>();
    const [conditions, setConditions] = useState<MedicalCondition[]>([]);
    const [loadingMap, setLoadingMap] = useState(true);
    const [loadingConditions, setLoadingConditions] = useState(false);
    const [tab, setTab] = useState('body-map');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const loadBodyMap = useCallback(() => {
        healthApi
            .getBodyMap(havenId)
            .then(({ data: res }) => {
                if (res.success && res.data) setRegions(res.data);
            })
            .finally(() => setLoadingMap(false));
    }, [havenId]);

    useEffect(() => {
        loadBodyMap();
    }, [loadBodyMap]);

    const loadConditions = useCallback(() => {
        if (!selectedRegion) {
            setConditions([]);
            return;
        }
        setLoadingConditions(true);
        healthApi
            .getConditions(havenId, 1, 50, undefined, selectedRegion)
            .then(({ data: res }) => {
                if (res.success && res.data) setConditions(res.data.items);
            })
            .finally(() => setLoadingConditions(false));
    }, [havenId, selectedRegion]);

    useEffect(() => {
        loadConditions();
    }, [loadConditions]);

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">Health</h1>
                    <p className="text-sm text-muted-foreground">
                        Track conditions, medications, and providers.
                    </p>
                </div>
                <ConditionForm
                    havenId={havenId}
                    defaultRegion={selectedRegion}
                    onCreated={() => {
                        loadBodyMap();
                        loadConditions();
                    }}
                />
            </div>

            <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="body-map" className="flex-1 sm:flex-initial">
                        Body Map
                    </TabsTrigger>
                    <TabsTrigger value="medications" className="flex-1 sm:flex-initial">
                        Medications
                    </TabsTrigger>
                    <TabsTrigger value="allergies" className="flex-1 sm:flex-initial">
                        Allergies
                    </TabsTrigger>
                    <TabsTrigger value="providers" className="flex-1 sm:flex-initial">
                        Providers
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {tab === 'body-map' && (
                <div className="space-y-4">
                    {loadingMap ? (
                        <Skeleton className="h-64 w-full max-w-[200px] mx-auto rounded-lg" />
                    ) : (
                        <BodyMapSvg
                            regions={regions}
                            selectedRegion={selectedRegion}
                            onSelectRegion={(r) =>
                                setSelectedRegion(selectedRegion === r ? undefined : r)
                            }
                        />
                    )}

                    {selectedRegion && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary capitalize">
                                {selectedRegion.replace(/_/g, ' ')} — Conditions
                            </h3>
                            {loadingConditions ? (
                                <Skeleton className="h-20 rounded-lg" />
                            ) : conditions.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No conditions for this region.
                                </p>
                            ) : (
                                conditions.map((c) => {
                                    const isExpanded = expandedId === c.id;
                                    const severityColor: Record<string, string> = {
                                        mild: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700',
                                        moderate: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
                                        severe: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
                                        critical: 'bg-red-200 text-red-900 border-red-400 dark:bg-red-900/60 dark:text-red-200 dark:border-red-600',
                                    };
                                    const statusColor: Record<string, string> = {
                                        active: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
                                        resolved: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700',
                                        chronic: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700',
                                        monitoring: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700',
                                    };
                                    return (
                                        <Card
                                            key={c.id}
                                            className="cursor-pointer transition-all hover:border-primary/30"
                                            onClick={() => setExpandedId(isExpanded ? null : c.id)}
                                        >
                                            <CardContent className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <Activity className="h-4 w-4 text-primary shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium">{c.name}</p>
                                                        {!isExpanded && c.notes && (
                                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                                {c.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        {c.severity && (
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    'text-xs capitalize border',
                                                                    severityColor[c.severity.toLowerCase()] ?? ''
                                                                )}
                                                            >
                                                                {c.severity}
                                                            </Badge>
                                                        )}
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                'text-xs capitalize border',
                                                                statusColor[c.status.toLowerCase()] ?? ''
                                                            )}
                                                        >
                                                            {c.status}
                                                        </Badge>
                                                        <ChevronDown
                                                            className={cn(
                                                                'h-4 w-4 text-muted-foreground transition-transform',
                                                                isExpanded && 'rotate-180'
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                {isExpanded && (
                                                    <div className="mt-3 pl-7 space-y-2 text-sm">
                                                        {c.notes && (
                                                            <div>
                                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</span>
                                                                <p className="text-muted-foreground mt-0.5">{c.notes}</p>
                                                            </div>
                                                        )}
                                                        {c.diagnosedAt && (
                                                            <div>
                                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Diagnosed</span>
                                                                <p className="text-muted-foreground mt-0.5">
                                                                    {new Date(c.diagnosedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {c.bodyRegion && (
                                                            <div>
                                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Region</span>
                                                                <p className="text-muted-foreground mt-0.5 capitalize">{c.bodyRegion.replace(/_/g, ' ')}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            )}

            {tab === 'medications' && <MedicationList havenId={havenId} />}
            {tab === 'allergies' && <AllergyList havenId={havenId} />}
            {tab === 'providers' && <ProviderList havenId={havenId} />}
        </div>
    );
}
