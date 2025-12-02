import { useState, useMemo } from 'react';
import { chartOfAccounts } from '../data/chartOfAccounts';
import { JournalEntryTable } from './JournalEntryTable';
import {
  LedgerCategory,
  LedgerAccount,
  JournalEntry,
  EntryType,
} from '../types';

// Forenklet fargepalett for kategorier
const categoryColors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-500' },
  green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', accent: 'bg-green-500' },
  red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: 'bg-red-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: 'bg-emerald-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', accent: 'bg-orange-500' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', accent: 'bg-violet-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', accent: 'bg-amber-500' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', accent: 'bg-slate-500' },
};

// Demo-data for visning
const generateMockEntries = (): JournalEntry[] => {
  return [
    {
      entryId: 'B-2024-001',
      entryType: 'sale',
      date: '2024-01-15',
      customerSupplierId: 'K-001',
      reference: 'Faktura 1001',
      createdAt: '2024-01-15T10:30:00',
      createdBy: 'Ole Hansen',
      isCrossed: false,
      isOpen: false,
      projectId: 'P-001',
      lines: [
        { lineId: '1', accountId: '1500', accountName: 'Kundefordringer', debit: 12500, credit: null, amount: 12500, vatCode: '0', vatAmount: 0, description: 'Faktura til kunde' },
        { lineId: '2', accountId: '3000', accountName: 'Salgsinntekt', debit: null, credit: 10000, amount: 10000, vatCode: '1', vatAmount: 2500, description: 'Salg av konsulenttjenester' },
        { lineId: '3', accountId: '2700', accountName: 'Utgående MVA', debit: null, credit: 2500, amount: 2500, vatCode: '1', vatAmount: 2500, description: 'MVA 25%' },
      ],
    },
    {
      entryId: 'B-2024-002',
      entryType: 'purchase',
      date: '2024-01-18',
      customerSupplierId: 'L-005',
      reference: 'Leverandørfaktura 5521',
      documentUrl: '/documents/receipts/5521.pdf',
      createdAt: '2024-01-18T14:15:00',
      createdBy: 'Kari Olsen',
      isCrossed: true,
      isOpen: false,
      lines: [
        { lineId: '1', accountId: '6800', accountName: 'Kontorrekvisita', debit: 2400, credit: null, amount: 2400, vatCode: '3', vatAmount: 600, description: 'Kontormateriell' },
        { lineId: '2', accountId: '2710', accountName: 'Inngående MVA', debit: 600, credit: null, amount: 600, vatCode: '3', vatAmount: 600, description: 'MVA 25%' },
        { lineId: '3', accountId: '2400', accountName: 'Leverandørgjeld', debit: null, credit: 3000, amount: 3000, vatCode: '0', vatAmount: 0, description: 'Skyldig leverandør' },
      ],
    },
    {
      entryId: 'B-2024-003',
      entryType: 'bank',
      date: '2024-01-20',
      reference: 'Bankoverføring',
      createdAt: '2024-01-20T09:00:00',
      createdBy: 'System',
      isCrossed: false,
      isOpen: true,
      lines: [
        { lineId: '1', accountId: '1920', accountName: 'Bankinnskudd', debit: 12500, credit: null, amount: 12500, vatCode: '0', vatAmount: 0, description: 'Innbetaling fra kunde' },
        { lineId: '2', accountId: '1500', accountName: 'Kundefordringer', debit: null, credit: 12500, amount: 12500, vatCode: '0', vatAmount: 0, description: 'Motregning kundefordring' },
      ],
    },
    {
      entryId: 'B-2024-004',
      entryType: 'salary',
      date: '2024-01-31',
      reference: 'Lønnskjøring januar',
      createdAt: '2024-01-31T12:00:00',
      createdBy: 'Kari Olsen',
      isCrossed: false,
      isOpen: false,
      lines: [
        { lineId: '1', accountId: '5000', accountName: 'Lønn', debit: 45000, credit: null, amount: 45000, vatCode: '0', vatAmount: 0, description: 'Bruttolønn' },
        { lineId: '2', accountId: '5400', accountName: 'Arbeidsgiveravgift', debit: 6345, credit: null, amount: 6345, vatCode: '0', vatAmount: 0, description: 'AGA 14.1%' },
        { lineId: '3', accountId: '2600', accountName: 'Skattetrekk', debit: null, credit: 13500, amount: 13500, vatCode: '0', vatAmount: 0, description: 'Forskuddstrekk' },
        { lineId: '4', accountId: '2770', accountName: 'Skyldig AGA', debit: null, credit: 6345, amount: 6345, vatCode: '0', vatAmount: 0, description: 'Skyldig arbeidsgiveravgift' },
        { lineId: '5', accountId: '2920', accountName: 'Skyldig lønn', debit: null, credit: 31500, amount: 31500, vatCode: '0', vatAmount: 0, description: 'Nettolønn til utbetaling' },
      ],
    },
    {
      entryId: 'B-2024-005',
      entryType: 'purchase',
      date: '2024-02-05',
      customerSupplierId: 'L-012',
      reference: 'Faktura 8842',
      createdAt: '2024-02-05T11:00:00',
      createdBy: 'Ole Hansen',
      isCrossed: false,
      isOpen: true,
      lines: [
        { lineId: '1', accountId: '6940', accountName: 'Lisenser og programvare', debit: 4800, credit: null, amount: 4800, vatCode: '3', vatAmount: 1200, description: 'Årsabonnement regnskapssystem' },
        { lineId: '2', accountId: '2710', accountName: 'Inngående MVA', debit: 1200, credit: null, amount: 1200, vatCode: '3', vatAmount: 1200, description: 'MVA 25%' },
        { lineId: '3', accountId: '2400', accountName: 'Leverandørgjeld', debit: null, credit: 6000, amount: 6000, vatCode: '0', vatAmount: 0, description: 'Skyldig leverandør' },
      ],
    },
  ];
};

// Hent alle unike kontoer fra kontoplanen
const getAllAccounts = (): { accountId: string; name: string }[] => {
  const accounts: { accountId: string; name: string }[] = [];
  chartOfAccounts.forEach(category => {
    category.subcategories.forEach(sub => {
      sub.accounts.forEach(acc => {
        accounts.push({ accountId: acc.accountId, name: acc.name });
      });
    });
  });
  return accounts.sort((a, b) => a.accountId.localeCompare(b.accountId));
};

interface FilterBarProps {
  period: { month: number; year: number };
  onPeriodChange: (period: { month: number; year: number }) => void;
  entryType: EntryType | '';
  onEntryTypeChange: (type: EntryType | '') => void;
  accountId: string;
  onAccountChange: (accountId: string) => void;
  crossingMode: 'all' | 'open';
  onCrossingModeChange: (mode: 'all' | 'open') => void;
  isCrossingEnabled: boolean;
  onCrossingEnabledChange: (enabled: boolean) => void;
}

function FilterBar({
  period,
  onPeriodChange,
  entryType,
  onEntryTypeChange,
  accountId,
  onAccountChange,
  crossingMode,
  onCrossingModeChange,
  isCrossingEnabled,
  onCrossingEnabledChange,
}: FilterBarProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ];

  const entryTypes: { value: EntryType | ''; label: string }[] = [
    { value: '', label: 'Alle typer' },
    { value: 'sale', label: 'Salg' },
    { value: 'purchase', label: 'Kjøp' },
    { value: 'salary', label: 'Lønn' },
    { value: 'bank', label: 'Bank' },
    { value: 'journal', label: 'Journalføring' },
    { value: 'depreciation', label: 'Avskrivning' },
    { value: 'adjustment', label: 'Justering' },
  ];

  const allAccounts = getAllAccounts();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Periode */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Periode:</label>
          <select
            value={period.month}
            onChange={(e) => onPeriodChange({ ...period, month: Number(e.target.value) })}
            className="rounded-md border-gray-300 text-sm focus:border-purple-500 focus:ring-purple-500"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={period.year}
            onChange={(e) => onPeriodChange({ ...period, year: Number(e.target.value) })}
            className="rounded-md border-gray-300 text-sm focus:border-purple-500 focus:ring-purple-500"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Bilagstype */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Bilagstype:</label>
          <select
            value={entryType}
            onChange={(e) => onEntryTypeChange(e.target.value as EntryType | '')}
            className="rounded-md border-gray-300 text-sm focus:border-purple-500 focus:ring-purple-500"
          >
            {entryTypes.map((et) => (
              <option key={et.value} value={et.value}>{et.label}</option>
            ))}
          </select>
        </div>

        {/* Konto */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Konto:</label>
          <select
            value={accountId}
            onChange={(e) => onAccountChange(e.target.value)}
            className="rounded-md border-gray-300 text-sm focus:border-purple-500 focus:ring-purple-500 max-w-[200px]"
          >
            <option value="">Alle kontoer</option>
            {allAccounts.map((acc) => (
              <option key={acc.accountId} value={acc.accountId}>
                {acc.accountId} - {acc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-gray-200 mx-2" />

        {/* Kryssing */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onCrossingEnabledChange(!isCrossingEnabled)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isCrossingEnabled
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Kryss bilag
          </button>

          {isCrossingEnabled && (
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => onCrossingModeChange('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-l-md border ${
                  crossingMode === 'all'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Alle bilag
              </button>
              <button
                onClick={() => onCrossingModeChange('open')}
                className={`px-3 py-1.5 text-sm font-medium rounded-r-md border-t border-r border-b -ml-px ${
                  crossingMode === 'open'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Kun åpne poster
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CategoryAccordionProps {
  category: LedgerCategory;
  isExpanded: boolean;
  onToggle: () => void;
  entries: JournalEntry[];
  isCrossingEnabled: boolean;
  onCrossedChange: (entryId: string, isCrossed: boolean) => void;
  selectedAccountId: string;
}

function CategoryAccordion({
  category,
  isExpanded,
  onToggle,
  entries,
  isCrossingEnabled,
  onCrossedChange,
  selectedAccountId,
}: CategoryAccordionProps) {
  const colors = categoryColors[category.color] || categoryColors.slate;

  // Hent alle kontoIDer i denne kategorien
  const categoryAccountIds = useMemo(() => {
    const ids = new Set<string>();
    category.subcategories.forEach(sub => {
      sub.accounts.forEach(acc => ids.add(acc.accountId));
    });
    return ids;
  }, [category]);

  // Filtrer bilag som tilhører denne kategorien
  const categoryEntries = useMemo(() => {
    return entries.filter(entry =>
      entry.lines.some(line => categoryAccountIds.has(line.accountId))
    );
  }, [entries, categoryAccountIds]);

  // Hent alle kontoer med bilag
  const accountsWithEntries = useMemo(() => {
    const accountMap = new Map<string, { account: LedgerAccount; entries: JournalEntry[] }>();

    category.subcategories.forEach(sub => {
      sub.accounts.forEach(account => {
        const accountEntries = entries.filter(entry =>
          entry.lines.some(line => line.accountId === account.accountId)
        );
        if (accountEntries.length > 0 || !selectedAccountId) {
          accountMap.set(account.accountId, { account, entries: accountEntries });
        }
      });
    });

    // Hvis en spesifikk konto er valgt, vis bare den
    if (selectedAccountId && categoryAccountIds.has(selectedAccountId)) {
      const filtered = new Map<string, { account: LedgerAccount; entries: JournalEntry[] }>();
      if (accountMap.has(selectedAccountId)) {
        filtered.set(selectedAccountId, accountMap.get(selectedAccountId)!);
      }
      return filtered;
    }

    return accountMap;
  }, [category, entries, selectedAccountId, categoryAccountIds]);

  // Ikke vis kategorien hvis en annen konto er valgt
  if (selectedAccountId && !categoryAccountIds.has(selectedAccountId)) {
    return null;
  }

  return (
    <div className={`border ${colors.border} rounded-lg overflow-hidden mb-4`}>
      {/* Kategori-header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 ${colors.bg} hover:opacity-95 transition-all`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-12 rounded-full ${colors.accent}`} />
          <div className="text-left">
            <h3 className={`text-lg font-semibold ${colors.text}`}>
              {category.name}
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">
              {category.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-mono bg-white/50 px-2 py-1 rounded">
            {category.accountRange}
          </span>
          {categoryEntries.length > 0 && (
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-white/80 ${colors.text}`}>
              {categoryEntries.length} bilag
            </span>
          )}
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Innhold - liste over kontoer */}
      {isExpanded && (
        <div className="bg-white divide-y divide-gray-100">
          {Array.from(accountsWithEntries.entries()).map(([accountId, { account, entries: accountEntries }]) => (
            <AccountRow
              key={accountId}
              account={account}
              entries={accountEntries}
              isCrossingEnabled={isCrossingEnabled}
              onCrossedChange={onCrossedChange}
              categoryColor={category.color}
            />
          ))}
          {accountsWithEntries.size === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              Ingen bilag i denne kategorien for valgt periode
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AccountRowProps {
  account: LedgerAccount;
  entries: JournalEntry[];
  isCrossingEnabled: boolean;
  onCrossedChange: (entryId: string, isCrossed: boolean) => void;
  categoryColor: string;
}

function AccountRow({ account, entries, isCrossingEnabled, onCrossedChange, categoryColor }: AccountRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = categoryColors[categoryColor] || categoryColors.slate;

  // Beregn sum debet og kredit for denne kontoen
  const totals = useMemo(() => {
    let debit = 0;
    let credit = 0;
    entries.forEach(entry => {
      entry.lines.forEach(line => {
        if (line.accountId === account.accountId) {
          debit += line.debit || 0;
          credit += line.credit || 0;
        }
      });
    });
    return { debit, credit, balance: debit - credit };
  }, [entries, account.accountId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nb-NO', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {entries.length > 0 ? (
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <div className="w-4" />
          )}
          <span className={`font-mono text-sm px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
            {account.accountId}
          </span>
          <span className="text-sm text-gray-700">
            {account.name}
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          {entries.length > 0 && (
            <>
              <div className="text-right">
                <span className="text-gray-500 mr-2">Debet:</span>
                <span className="font-mono text-gray-900">{formatCurrency(totals.debit)}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-500 mr-2">Kredit:</span>
                <span className="font-mono text-gray-900">{formatCurrency(totals.credit)}</span>
              </div>
              <div className="text-right min-w-[100px]">
                <span className="text-gray-500 mr-2">Saldo:</span>
                <span className={`font-mono font-medium ${totals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(totals.balance))}
                </span>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {entries.length} bilag
              </span>
            </>
          )}
        </div>
      </button>

      {/* Bilagstabell */}
      {isExpanded && entries.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <JournalEntryTable
            entries={entries}
            onCrossedChange={onCrossedChange}
            showAccountColumn={false}
            showCrossingCheckbox={isCrossingEnabled}
          />
        </div>
      )}
    </div>
  );
}

export function GeneralLedger() {
  const currentDate = new Date();

  // Filter state
  const [period, setPeriod] = useState({ month: currentDate.getMonth() + 1, year: currentDate.getFullYear() });
  const [entryType, setEntryType] = useState<EntryType | ''>('');
  const [accountId, setAccountId] = useState('');
  const [crossingMode, setCrossingMode] = useState<'all' | 'open'>('all');
  const [isCrossingEnabled, setIsCrossingEnabled] = useState(false);

  // Accordion state
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Data
  const [entries, setEntries] = useState<JournalEntry[]>(generateMockEntries());

  // Filtrer bilag
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    // Filtrer på bilagstype
    if (entryType) {
      result = result.filter(e => e.entryType === entryType);
    }

    // Filtrer på konto
    if (accountId) {
      result = result.filter(e =>
        e.lines.some(line => line.accountId === accountId)
      );
    }

    // Filtrer på åpne poster når kryssing er aktivert
    if (isCrossingEnabled && crossingMode === 'open') {
      result = result.filter(e => e.isOpen);
    }

    // Filtrer på periode (for demo viser vi alle 2024-bilag)
    result = result.filter(e => {
      const date = new Date(e.date);
      return date.getFullYear() === period.year;
    });

    return result;
  }, [entries, entryType, accountId, isCrossingEnabled, crossingMode, period]);

  // Toggle kategori
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Håndter kryssing
  const handleCrossedChange = (entryId: string, isCrossed: boolean) => {
    setEntries(prev =>
      prev.map(e => (e.entryId === entryId ? { ...e, isCrossed } : e))
    );
  };

  // Utvid/lukk alle
  const expandAll = () => {
    setExpandedCategories(new Set(chartOfAccounts.map(c => c.id)));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  // Tell antall bilag med kryssing
  const crossedCount = entries.filter(e => e.isCrossed).length;
  const openCount = entries.filter(e => e.isOpen).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hovedbok</h1>
        <p className="mt-2 text-gray-600">
          Oversikt over alle kontoer og bilag i regnskapet
        </p>
      </div>

      {/* Filterbar */}
      <FilterBar
        period={period}
        onPeriodChange={setPeriod}
        entryType={entryType}
        onEntryTypeChange={setEntryType}
        accountId={accountId}
        onAccountChange={setAccountId}
        crossingMode={crossingMode}
        onCrossingModeChange={setCrossingMode}
        isCrossingEnabled={isCrossingEnabled}
        onCrossingEnabledChange={setIsCrossingEnabled}
      />

      {/* Statuslinje */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{filteredEntries.length} bilag</span>
          {isCrossingEnabled && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {crossedCount} krysset
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                {openCount} åpne poster
              </span>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Utvid alle
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Lukk alle
          </button>
        </div>
      </div>

      {/* Kategori-accordion */}
      <div>
        {chartOfAccounts.map(category => (
          <CategoryAccordion
            key={category.id}
            category={category}
            isExpanded={expandedCategories.has(category.id)}
            onToggle={() => toggleCategory(category.id)}
            entries={filteredEntries}
            isCrossingEnabled={isCrossingEnabled}
            onCrossedChange={handleCrossedChange}
            selectedAccountId={accountId}
          />
        ))}
      </div>
    </div>
  );
}

export default GeneralLedger;
