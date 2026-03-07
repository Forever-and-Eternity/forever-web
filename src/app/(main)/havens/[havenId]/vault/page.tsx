'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { KeychainUnlock } from '@/components/keychain/keychain-unlock';
import { CategoryGrid } from '@/components/keychain/category-grid';
import { KeychainItemList } from '@/components/keychain/keychain-item-list';
import { KeychainEntryForm } from '@/components/keychain/keychain-entry-form';
import { keychainApi } from '@/lib/api/keychain';
import { decrypt } from '@/lib/crypto/aes';
import type {
  KeychainCategory,
  KeychainEntryList,
  KeychainEntry,
} from '@/lib/types/keychain';
import {
  Shield,
  Lock,
  Building,
  FileText,
  StickyNote,
  Copy,
  Eye,
  EyeOff,
  Paperclip,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { contentApi } from '@/lib/api/content';
import type { ContentItem } from '@/lib/types/content';

const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

const ENTRY_TYPE_ICONS: Record<string, React.ElementType> = {
  login: Lock,
  bank: Building,
  insurance: Shield,
  legal: FileText,
  note: StickyNote,
};

const FIELD_LABELS: Record<string, Record<string, string>> = {
  login: { website: 'Website', username: 'Username', password: 'Password' },
  bank: {
    bankName: 'Bank Name',
    accountNumber: 'Account Number',
    sortCode: 'Sort Code',
    iban: 'IBAN',
    swift: 'SWIFT/BIC',
  },
  insurance: {
    provider: 'Provider',
    policyNumber: 'Policy Number',
    type: 'Type',
    expiryDate: 'Expiry Date',
    contactPhone: 'Contact Phone',
  },
  legal: {
    documentType: 'Document Type',
    reference: 'Reference',
    issuer: 'Issuer',
    expiryDate: 'Expiry Date',
    details: 'Details',
  },
  note: { content: 'Content' },
};

const SENSITIVE_FIELDS = new Set(['password', 'accountNumber', 'sortCode', 'iban', 'swift', 'policyNumber']);

export default function VaultPage() {
  const params = useParams();
  const havenId = params.havenId as string;

  // Auth state
  const [unlocked, setUnlocked] = useState(false);
  const [vaultPassword, setVaultPassword] = useState('');
  const unlockTimeRef = useRef<number>(0);

  // Data state
  const [categories, setCategories] = useState<KeychainCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [entries, setEntries] = useState<KeychainEntryList[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(false);

  // Dialogs / Sheets
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [addCategoryLoading, setAddCategoryLoading] = useState(false);

  const [entryFormOpen, setEntryFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<KeychainEntry | undefined>();

  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [viewEntry, setViewEntry] = useState<KeychainEntry | undefined>();
  const [viewFields, setViewFields] = useState<Record<string, string>>({});
  const [viewDecrypting, setViewDecrypting] = useState(false);
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());
  const [viewAttachments, setViewAttachments] = useState<ContentItem[]>([]);

  // Session timeout: auto-lock after 5 minutes
  useEffect(() => {
    if (!unlocked) return;

    const timer = setTimeout(() => {
      setUnlocked(false);
      setVaultPassword('');
      setCategories([]);
      setEntries([]);
      setSelectedCategoryId(undefined);
      toast.info('Vault locked due to inactivity');
    }, SESSION_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [unlocked]);

  const handleUnlock = (password: string) => {
    setVaultPassword(password);
    setUnlocked(true);
    unlockTimeRef.current = Date.now();
  };

  // Load categories
  const loadCategories = useCallback(() => {
    if (!unlocked) return;
    setLoadingCategories(true);
    keychainApi
      .getCategories(havenId)
      .then(({ data: res }) => {
        if (res.success && res.data) {
          setCategories(res.data);
          // Auto-select first category if none selected
          if (!selectedCategoryId && res.data.length > 0) {
            setSelectedCategoryId(res.data[0].id);
          }
        }
      })
      .catch(() => {
        toast.error('Failed to load categories');
      })
      .finally(() => setLoadingCategories(false));
  }, [havenId, unlocked, selectedCategoryId]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Load entries for selected category
  const loadEntries = useCallback(() => {
    if (!unlocked || !selectedCategoryId) {
      setEntries([]);
      return;
    }
    setLoadingEntries(true);
    keychainApi
      .getEntries(havenId, selectedCategoryId)
      .then(({ data: res }) => {
        if (res.success && res.data) setEntries(res.data);
      })
      .catch(() => {
        toast.error('Failed to load entries');
      })
      .finally(() => setLoadingEntries(false));
  }, [havenId, unlocked, selectedCategoryId]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Add category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setAddCategoryLoading(true);
    try {
      const { data: res } = await keychainApi.createCategory(havenId, {
        name: newCategoryName.trim(),
        icon: newCategoryIcon.trim() || undefined,
        sortOrder: categories.length,
      });
      if (res.success && res.data) {
        setCategories((prev) => [...prev, res.data!]);
        setSelectedCategoryId(res.data.id);
        toast.success('Category created');
        setAddCategoryOpen(false);
        setNewCategoryName('');
        setNewCategoryIcon('');
      }
    } catch {
      toast.error('Failed to create category');
    } finally {
      setAddCategoryLoading(false);
    }
  };

  // View entry
  const handleViewEntry = async (entryId: string) => {
    setViewSheetOpen(true);
    setViewDecrypting(true);
    setViewFields({});
    setVisibleFields(new Set());
    setViewAttachments([]);
    try {
      const { data: res } = await keychainApi.getEntry(havenId, entryId);
      if (res.success && res.data) {
        setViewEntry(res.data);
        const plaintext = await decrypt(
          res.data.encryptedData,
          res.data.iv,
          vaultPassword,
          havenId,
        );
        setViewFields(JSON.parse(plaintext));

        // Load attachments
        if (res.data.contentIds?.length > 0) {
          const attachments = await Promise.all(
            res.data.contentIds.map(async (cid: string) => {
              try {
                const { data: contentRes } = await contentApi.get(havenId, cid);
                return contentRes.success ? contentRes.data : null;
              } catch { return null; }
            })
          );
          setViewAttachments(attachments.filter(Boolean) as ContentItem[]);
        }
      }
    } catch {
      toast.error('Failed to load entry');
      setViewSheetOpen(false);
    } finally {
      setViewDecrypting(false);
    }
  };

  // Edit entry (from view sheet)
  const handleEditEntry = () => {
    if (!viewEntry) return;
    setViewSheetOpen(false);
    setEditingEntry(viewEntry);
    setEntryFormOpen(true);
  };

  // Delete entry
  const handleDeleteEntry = async () => {
    if (!viewEntry) return;
    try {
      await keychainApi.deleteEntry(havenId, viewEntry.id);
      toast.success('Entry deleted');
      setViewSheetOpen(false);
      setViewEntry(undefined);
      loadEntries();
      loadCategories();
    } catch {
      toast.error('Failed to delete entry');
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const toggleFieldVisibility = (fieldKey: string) => {
    setVisibleFields((prev) => {
      const next = new Set(prev);
      if (next.has(fieldKey)) {
        next.delete(fieldKey);
      } else {
        next.add(fieldKey);
      }
      return next;
    });
  };

  if (!unlocked) {
    return <KeychainUnlock havenId={havenId} onUnlock={handleUnlock} />;
  }

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Secure Vault</h1>
            <p className="text-sm text-muted-foreground">
              Zero-knowledge encrypted credentials and documents
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setUnlocked(false);
            setVaultPassword('');
            setCategories([]);
            setEntries([]);
            setSelectedCategoryId(undefined);
          }}
          
        >
          <Lock className="h-4 w-4 mr-1" />
          Lock
        </Button>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
          Categories
        </h2>
        {loadingCategories ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <CategoryGrid
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            onAdd={() => setAddCategoryOpen(true)}
          />
        )}
      </div>

      {/* Entries for selected category */}
      {selectedCategoryId && (
        <div>
          {selectedCategory && (
            <p className="text-sm text-muted-foreground mb-3">
              Showing entries in <span className="font-medium text-foreground">{selectedCategory.name}</span>
            </p>
          )}
          {loadingEntries ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : (
            <KeychainItemList
              entries={entries}
              onView={handleViewEntry}
              onAdd={() => {
                setEditingEntry(undefined);
                setEntryFormOpen(true);
              }}
            />
          )}
        </div>
      )}

      {/* Add Category Dialog */}
      <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Banking, Social Media"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Icon / Emoji (optional)</Label>
              <Input
                placeholder="e.g. bank emoji, lock emoji"
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                maxLength={4}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={addCategoryLoading || !newCategoryName.trim()}
                
              >
                {addCategoryLoading ? 'Creating...' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Entry Form Sheet */}
      {selectedCategoryId && (
        <KeychainEntryForm
          havenId={havenId}
          password={vaultPassword}
          categoryId={selectedCategoryId}
          entry={editingEntry}
          open={entryFormOpen}
          onOpenChange={(open) => {
            setEntryFormOpen(open);
            if (!open) setEditingEntry(undefined);
          }}
          onSaved={() => {
            loadEntries();
            loadCategories();
          }}
        />
      )}

      {/* View Entry Sheet */}
      <Sheet open={viewSheetOpen} onOpenChange={(open) => {
        setViewSheetOpen(open);
        if (!open) {
          setViewAttachments([]);
        }
      }}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{viewEntry?.label || 'Entry'}</SheetTitle>
          </SheetHeader>
          {viewDecrypting ? (
            <div className="flex items-center justify-center py-12 px-4">
              <p className="text-sm text-muted-foreground">Decrypting...</p>
            </div>
          ) : viewEntry ? (
            <div className="space-y-4 mt-4 px-4 pb-4">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = ENTRY_TYPE_ICONS[viewEntry.entryType] || Lock;
                  return <Icon className="h-4 w-4 text-primary" />;
                })()}
                <Badge variant="outline" className="capitalize">
                  {viewEntry.entryType}
                </Badge>
              </div>

              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-3">
                  {Object.entries(viewFields).map(([key, value]) => {
                    if (!value) return null;
                    const labels = FIELD_LABELS[viewEntry.entryType] || {};
                    const fieldLabel = labels[key] || key;
                    const isSensitive = SENSITIVE_FIELDS.has(key);
                    const isVisible = visibleFields.has(key);
                    const displayValue =
                      isSensitive && !isVisible
                        ? '\u2022'.repeat(Math.min(value.length, 16))
                        : value;

                    return (
                      <div
                        key={key}
                        className="flex items-start justify-between gap-2 rounded-lg border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            {fieldLabel}
                          </p>
                          <p className="text-sm font-mono break-all">
                            {displayValue}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {isSensitive && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleFieldVisibility(key)
                                    }
                                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {isVisible ? (
                                      <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                      <Eye className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {isVisible ? 'Hide' : 'Show'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyToClipboard(value)
                                  }
                                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Copy</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {viewAttachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Attachments</p>
                  <div className="space-y-2">
                    {viewAttachments.map(att => (
                      <div key={att.id} className="flex items-center gap-3 rounded-lg border p-3">
                        {att.thumbnailUrl ? (
                          <img src={att.thumbnailUrl} alt="" className="h-12 w-12 rounded object-cover shrink-0" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded bg-muted shrink-0">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{att.title || 'Attachment'}</p>
                          <p className="text-xs text-muted-foreground">{att.contentType}</p>
                        </div>
                        {att.mediaUrl && (
                          <a href={att.mediaUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewEntry.notes && (
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Notes</p>
                  <p className="text-sm">{viewEntry.notes}</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Last updated{' '}
                {new Date(viewEntry.updatedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleEditEntry}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  
                  onClick={handleDeleteEntry}
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
