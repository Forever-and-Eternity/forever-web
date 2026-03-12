'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { keychainApi } from '@/lib/api/keychain';
import { encrypt, decrypt } from '@/lib/crypto/aes';
import type {
  KeychainEntry,
  LoginFields,
  BankFields,
  InsuranceFields,
  LegalFields,
  NoteFields,
} from '@/lib/types/keychain';
import { Eye, EyeOff, Paperclip, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/api/upload';
import { ContentType } from '@/lib/types/enums';

const ENTRY_TYPES = [
  { value: 'login', label: 'Login' },
  { value: 'bank', label: 'Bank Account' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'legal', label: 'Legal Document' },
  { value: 'note', label: 'Secure Note' },
];

interface KeychainEntryFormProps {
  havenId: string;
  password: string;
  sessionToken: string;
  categoryId: string;
  entry?: KeychainEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function KeychainEntryForm({
  havenId,
  password,
  sessionToken,
  categoryId,
  entry,
  open,
  onOpenChange,
  onSaved,
}: KeychainEntryFormProps) {
  const [label, setLabel] = useState('');
  const [entryType, setEntryType] = useState('login');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [decrypting, setDecrypting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Bank fields
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [iban, setIban] = useState('');
  const [swift, setSwift] = useState('');

  // Insurance fields
  const [provider, setProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [insuranceType, setInsuranceType] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Legal fields
  const [documentType, setDocumentType] = useState('');
  const [reference, setReference] = useState('');
  const [issuer, setIssuer] = useState('');
  const [legalExpiry, setLegalExpiry] = useState('');
  const [details, setDetails] = useState('');

  // Note fields
  const [noteContent, setNoteContent] = useState('');

  // Attachment fields
  const [contentIds, setContentIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileNames, setFileNames] = useState<Map<string, string>>(new Map());

  function getContentType(file: File): ContentType {
    if (file.type.startsWith('image/')) return ContentType.Photo;
    return ContentType.Document;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const result = await uploadFile(havenId, file, getContentType(file));
        if (result) {
          setContentIds(prev => [...prev, result.id]);
          setFileNames(prev => new Map(prev).set(result.id, file.name));
        }
      }
    } catch {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const resetFields = () => {
    setLabel('');
    setEntryType('login');
    setNotes('');
    setShowPassword(false);
    setWebsite('');
    setUsername('');
    setLoginPassword('');
    setBankName('');
    setAccountNumber('');
    setSortCode('');
    setIban('');
    setSwift('');
    setProvider('');
    setPolicyNumber('');
    setInsuranceType('');
    setInsuranceExpiry('');
    setContactPhone('');
    setDocumentType('');
    setReference('');
    setIssuer('');
    setLegalExpiry('');
    setDetails('');
    setNoteContent('');
    setContentIds([]);
    setFileNames(new Map());
  };

  useEffect(() => {
    if (!open) return;

    if (entry) {
      setLabel(entry.label);
      setEntryType(entry.entryType);
      setNotes(entry.notes || '');
      setContentIds(entry.contentIds || []);
      setFileNames(new Map());
      setDecrypting(true);

      decrypt(entry.encryptedData, entry.iv, password, havenId)
        .then((plaintext) => {
          const fields = JSON.parse(plaintext);
          populateFields(entry.entryType, fields);
        })
        .catch(() => {
          toast.error('Failed to decrypt entry');
        })
        .finally(() => setDecrypting(false));
    } else {
      resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, entry]);

  const populateFields = (type: string, fields: Record<string, string>) => {
    switch (type) {
      case 'login':
        setWebsite(fields.website || '');
        setUsername(fields.username || '');
        setLoginPassword(fields.password || '');
        break;
      case 'bank':
        setBankName(fields.bankName || '');
        setAccountNumber(fields.accountNumber || '');
        setSortCode(fields.sortCode || '');
        setIban(fields.iban || '');
        setSwift(fields.swift || '');
        break;
      case 'insurance':
        setProvider(fields.provider || '');
        setPolicyNumber(fields.policyNumber || '');
        setInsuranceType(fields.type || '');
        setInsuranceExpiry(fields.expiryDate || '');
        setContactPhone(fields.contactPhone || '');
        break;
      case 'legal':
        setDocumentType(fields.documentType || '');
        setReference(fields.reference || '');
        setIssuer(fields.issuer || '');
        setLegalExpiry(fields.expiryDate || '');
        setDetails(fields.details || '');
        break;
      case 'note':
        setNoteContent(fields.content || '');
        break;
    }
  };

  const collectFields = (): Record<string, string | undefined> => {
    switch (entryType) {
      case 'login':
        return { website, username, password: loginPassword } satisfies LoginFields;
      case 'bank':
        return { bankName, accountNumber, sortCode, iban, swift } satisfies BankFields;
      case 'insurance':
        return {
          provider,
          policyNumber,
          type: insuranceType,
          expiryDate: insuranceExpiry,
          contactPhone,
        } satisfies InsuranceFields;
      case 'legal':
        return {
          documentType,
          reference,
          issuer,
          expiryDate: legalExpiry,
          details,
        } satisfies LegalFields;
      case 'note':
        return { content: noteContent } satisfies NoteFields;
      default:
        return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    setLoading(true);
    try {
      const fields = collectFields();
      const jsonData = JSON.stringify(fields);
      const { encryptedData, iv } = await encrypt(jsonData, password, havenId);

      if (entry) {
        await keychainApi.updateEntry(havenId, entry.id, {
          label,
          entryType,
          encryptedData,
          iv,
          notes: notes || undefined,
          contentIds,
        }, sessionToken);
        toast.success('Entry updated');
      } else {
        await keychainApi.createEntry(havenId, {
          categoryId,
          label,
          entryType,
          encryptedData,
          iv,
          notes: notes || undefined,
          contentIds,
        }, sessionToken);
        toast.success('Entry created');
      }
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error(entry ? 'Failed to update entry' : 'Failed to create entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{entry ? 'Edit Entry' : 'New Entry'}</SheetTitle>
          <SheetDescription>{entry ? 'Update this vault entry' : 'Add a new vault entry'}</SheetDescription>
        </SheetHeader>
        {decrypting ? (
          <div className="flex items-center justify-center py-12 px-4">
            <p className="text-sm text-muted-foreground">Decrypting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4 px-4 pb-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                placeholder="e.g. Gmail Account"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={entryType}
                onValueChange={(val) => {
                  setEntryType(val);
                  setShowPassword(false);
                }}
                disabled={!!entry}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENTRY_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic fields based on entry type */}
            {entryType === 'login' && (
              <>
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    placeholder="your@email.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {entryType === 'bank' && (
              <>
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input
                    placeholder="e.g. HSBC"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input
                      placeholder="12345678"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sort Code</Label>
                    <Input
                      placeholder="12-34-56"
                      value={sortCode}
                      onChange={(e) => setSortCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>IBAN</Label>
                    <Input
                      placeholder="GB00 XXXX..."
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SWIFT/BIC</Label>
                    <Input
                      placeholder="HSBCGB2L"
                      value={swift}
                      onChange={(e) => setSwift(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {entryType === 'insurance' && (
              <>
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Input
                    placeholder="e.g. Aviva"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Policy Number</Label>
                    <Input
                      placeholder="POL-12345"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Input
                      placeholder="e.g. Life, Home"
                      value={insuranceType}
                      onChange={(e) => setInsuranceType(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={insuranceExpiry}
                      onChange={(e) => setInsuranceExpiry(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input
                      type="tel"
                      placeholder="+44 123 456 7890"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {entryType === 'legal' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Document Type</Label>
                    <Input
                      placeholder="e.g. Will, Power of Attorney"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reference</Label>
                    <Input
                      placeholder="REF-12345"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Issuer</Label>
                    <Input
                      placeholder="e.g. Smith & Co Solicitors"
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={legalExpiry}
                      onChange={(e) => setLegalExpiry(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Details</Label>
                  <Textarea
                    placeholder="Additional details..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </>
            )}

            {entryType === 'note' && (
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  placeholder="Write your secure note..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Attachments</Label>
              {contentIds.length > 0 && (
                <div className="space-y-1.5">
                  {contentIds.map(id => (
                    <div key={id} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                      <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate flex-1">{fileNames.get(id) || id.slice(0, 8) + '...'}</span>
                      <button type="button" onClick={() => {
                        setContentIds(prev => prev.filter(cid => cid !== id));
                        setFileNames(prev => { const m = new Map(prev); m.delete(id); return m; });
                      }} className="text-muted-foreground hover:text-destructive transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => document.getElementById('vault-file-input')?.click()}>
                  {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Paperclip className="h-4 w-4 mr-1" />}
                  {uploading ? 'Uploading...' : 'Attach Files'}
                </Button>
                <input id="vault-file-input" type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx" className="hidden" onChange={handleFileUpload} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Input
                placeholder="Quick description (unencrypted)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !label.trim()}
            >
              {loading ? 'Saving...' : entry ? 'Update Entry' : 'Create Entry'}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
