export interface Department {
  id?: number;
  code: string;
  name: string;
  description: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id?: number;
  code: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const ProjectStatus = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  CANCELLED: 'CANCELLED'
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Ledger types following Norwegian accounting standards (NS 4102)
export type EntryType =
  | 'sale'           // Salg
  | 'purchase'       // Kjøp
  | 'salary'         // Lønn
  | 'bank'           // Bank
  | 'journal'        // Journalføring
  | 'depreciation'   // Avskrivning
  | 'adjustment';    // Justering

export type VATCode =
  | '0'   // Ingen MVA
  | '1'   // Utgående MVA 25%
  | '11'  // Utgående MVA 15%
  | '13'  // Utgående MVA 12%
  | '3'   // Inngående MVA 25%
  | '31'  // Inngående MVA 15%
  | '33'  // Inngående MVA 12%
  | '5'   // Fritak for MVA
  | '6'   // Utenfor MVA-loven
  | '7'   // Ingen MVA-behandling
  | '14'  // Omvendt avgiftsplikt
  | '81'  // Import varer
  | '83'  // Import tjenester
  | '86'  // Innførsel næringsmidler
  | '87'; // Innførsel råvarer

export interface JournalEntryLine {
  lineId: string;
  accountId: string;
  accountName: string;
  debit: number | null;
  credit: number | null;
  amount: number;
  vatCode: string;
  vatAmount: number;
  description: string;
}

export interface JournalEntry {
  entryId: string;
  entryType: EntryType;
  date: string;
  lines: JournalEntryLine[];
  customerSupplierId?: string;
  documentUrl?: string;
  createdAt: string;
  createdBy: string;
  currency?: string;
  reference?: string;
  projectId?: string;
  isCrossed: boolean;
  isOpen: boolean;
}

export interface LedgerAccount {
  accountId: string;
  name: string;
  nameEn?: string;
  description?: string;
  entries: JournalEntry[];
}

export interface LedgerSubcategory {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  accounts: LedgerAccount[];
}

export interface LedgerCategory {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  accountRange: string;
  subcategories: LedgerSubcategory[];
  color: string;
}

// Filter and sorting options
export interface LedgerFilters {
  period: {
    type: 'month' | 'year' | 'custom';
    startDate?: string;
    endDate?: string;
    month?: number;
    year?: number;
  };
  projectId?: string;
  showCrossedOnly: boolean;
  showOpenOnly: boolean;
  entryType?: EntryType;
  searchQuery?: string;
}

export type SortField =
  | 'date'
  | 'entryId'
  | 'amount'
  | 'accountId'
  | 'entryType';

export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}
