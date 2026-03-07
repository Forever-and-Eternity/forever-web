'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Building, Shield, FileText, StickyNote, Plus, Paperclip } from 'lucide-react';
import type { KeychainEntryList } from '@/lib/types/keychain';

const ENTRY_TYPE_ICONS: Record<string, React.ElementType> = {
  login: Lock,
  bank: Building,
  insurance: Shield,
  legal: FileText,
  note: StickyNote,
};

const ENTRY_TYPE_LABELS: Record<string, string> = {
  login: 'Login',
  bank: 'Bank',
  insurance: 'Insurance',
  legal: 'Legal',
  note: 'Note',
};

interface KeychainItemListProps {
  entries: KeychainEntryList[];
  onView: (id: string) => void;
  onAdd: () => void;
}

export function KeychainItemList({ entries, onView, onAdd }: KeychainItemListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary">
          Entries
        </h3>
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Add Entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            No entries in this category yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Add your first secure entry above.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const Icon = ENTRY_TYPE_ICONS[entry.entryType] || Lock;
            const typeLabel = ENTRY_TYPE_LABELS[entry.entryType] || entry.entryType;

            return (
              <button
                key={entry.id}
                onClick={() => onView(entry.id)}
                className="w-full text-left"
              >
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="py-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {entry.label}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {entry.attachmentCount > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <Paperclip className="h-3 w-3" />
                          {entry.attachmentCount}
                        </span>
                      )}
                      <Badge variant="outline" className="text-xs capitalize">
                        {typeLabel}
                      </Badge>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {new Date(entry.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
