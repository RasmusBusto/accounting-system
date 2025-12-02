import { useState } from 'react';
import { JournalEntry, EntryType } from '../types';

interface JournalEntryTableProps {
  entries: JournalEntry[];
  onCrossedChange?: (entryId: string, isCrossed: boolean) => void;
  showAccountColumn?: boolean;
  showCrossingCheckbox?: boolean;
}

const entryTypeLabels: Record<EntryType, string> = {
  sale: 'Salg',
  purchase: 'Kjøp',
  salary: 'Lønn',
  bank: 'Bank',
  journal: 'Journal',
  depreciation: 'Avskr.',
  adjustment: 'Just.',
};

const entryTypeColors: Record<EntryType, string> = {
  sale: 'bg-green-100 text-green-700',
  purchase: 'bg-blue-100 text-blue-700',
  salary: 'bg-purple-100 text-purple-700',
  bank: 'bg-cyan-100 text-cyan-700',
  journal: 'bg-gray-100 text-gray-700',
  depreciation: 'bg-orange-100 text-orange-700',
  adjustment: 'bg-yellow-100 text-yellow-700',
};

export function JournalEntryTable({
  entries,
  onCrossedChange,
  showAccountColumn = true,
  showCrossingCheckbox = false,
}: JournalEntryTableProps) {
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const toggleExpand = (entryId: string) => {
    setExpandedEntries((prev) => {
      const next = new Set(prev);
      if (next.has(entryId)) {
        next.delete(entryId);
      } else {
        next.add(entryId);
      }
      return next;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nb-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === 0) return '';
    return new Intl.NumberFormat('nb-NO', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Ingen bilag funnet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {showCrossingCheckbox && (
              <th scope="col" className="w-10 px-3 py-3">
                <span className="sr-only">Kryss</span>
              </th>
            )}
            <th scope="col" className="w-8 px-2 py-3">
              <span className="sr-only">Utvid</span>
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bilagsnr
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dato
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            {showAccountColumn && (
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Konto
              </th>
            )}
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Beskrivelse
            </th>
            <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Debet
            </th>
            <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kredit
            </th>
            <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dok
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map((entry) => {
            const isExpanded = expandedEntries.has(entry.entryId);
            const totalDebit = entry.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
            const totalCredit = entry.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
            const primaryLine = entry.lines[0];

            return (
              <>
                <tr
                  key={entry.entryId}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    isExpanded ? 'bg-purple-50' : ''
                  } ${entry.isCrossed ? 'bg-green-50/50' : ''}`}
                  onClick={() => toggleExpand(entry.entryId)}
                >
                  {showCrossingCheckbox && (
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={entry.isCrossed}
                          onChange={(e) => {
                            onCrossedChange?.(entry.entryId, e.target.checked);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        {entry.isCrossed && (
                          <svg className="w-4 h-4 ml-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-2 py-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">
                    {entry.entryId}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600">
                    {formatDate(entry.date)}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${entryTypeColors[entry.entryType]}`}>
                      {entryTypeLabels[entry.entryType]}
                    </span>
                  </td>
                  {showAccountColumn && (
                    <td className="px-3 py-3 text-sm text-gray-600">
                      {primaryLine && (
                        <span>
                          <span className="font-mono text-gray-900">{primaryLine.accountId}</span>
                          {' '}
                          <span className="text-gray-500">{primaryLine.accountName}</span>
                        </span>
                      )}
                      {entry.lines.length > 1 && (
                        <span className="ml-1 text-xs text-gray-400">
                          (+{entry.lines.length - 1})
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-3 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {primaryLine?.description || entry.reference || '—'}
                  </td>
                  <td className="px-3 py-3 text-sm text-right font-mono text-gray-900">
                    {formatCurrency(totalDebit)}
                  </td>
                  <td className="px-3 py-3 text-sm text-right font-mono text-gray-900">
                    {formatCurrency(totalCredit)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {entry.isOpen ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        Åpen
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                        Lukket
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {entry.documentUrl ? (
                      <a
                        href={entry.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center text-purple-600 hover:text-purple-800"
                        title="Vis dokument"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>

                {isExpanded && (
                  <tr key={`${entry.entryId}-details`}>
                    <td colSpan={showCrossingCheckbox ? (showAccountColumn ? 12 : 11) : (showAccountColumn ? 11 : 10)} className="px-0 py-0">
                      <div className="bg-gray-50 border-l-4 border-purple-400 mx-4 my-2 rounded-r shadow-sm">
                        <div className="px-4 py-3">
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-4 pb-3 border-b border-gray-200">
                            <div>
                              <span className="text-gray-500">Opprettet:</span>{' '}
                              <span className="text-gray-900">{formatDate(entry.createdAt)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Av:</span>{' '}
                              <span className="text-gray-900">{entry.createdBy}</span>
                            </div>
                            {entry.reference && (
                              <div>
                                <span className="text-gray-500">Referanse:</span>{' '}
                                <span className="text-gray-900">{entry.reference}</span>
                              </div>
                            )}
                            {entry.customerSupplierId && (
                              <div>
                                <span className="text-gray-500">Kunde/Lev.:</span>{' '}
                                <span className="text-gray-900">{entry.customerSupplierId}</span>
                              </div>
                            )}
                            {entry.projectId && (
                              <div>
                                <span className="text-gray-500">Prosjekt:</span>{' '}
                                <span className="text-gray-900">{entry.projectId}</span>
                              </div>
                            )}
                          </div>

                          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-16">
                                  Linje
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Konto
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Beskrivelse
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-20">
                                  MVA
                                </th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase w-24">
                                  MVA-beløp
                                </th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase w-28">
                                  Debet
                                </th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase w-28">
                                  Kredit
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {entry.lines.map((line) => (
                                <tr key={line.lineId} className="hover:bg-gray-50">
                                  <td className="px-3 py-2 text-sm text-gray-500 font-mono">
                                    {line.lineId}
                                  </td>
                                  <td className="px-3 py-2 text-sm">
                                    <span className="font-mono text-gray-900">{line.accountId}</span>
                                    {' '}
                                    <span className="text-gray-500">{line.accountName}</span>
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-600">
                                    {line.description || '—'}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-600 font-mono">
                                    {line.vatCode !== '0' ? line.vatCode : '—'}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-right font-mono text-gray-600">
                                    {line.vatAmount > 0 ? formatCurrency(line.vatAmount) : '—'}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-right font-mono text-gray-900">
                                    {formatCurrency(line.debit)}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-right font-mono text-gray-900">
                                    {formatCurrency(line.credit)}
                                  </td>
                                </tr>
                              ))}
                              <tr className="bg-gray-50 font-medium">
                                <td colSpan={5} className="px-3 py-2 text-sm text-right text-gray-700">
                                  Sum:
                                </td>
                                <td className="px-3 py-2 text-sm text-right font-mono text-gray-900">
                                  {formatCurrency(totalDebit)}
                                </td>
                                <td className="px-3 py-2 text-sm text-right font-mono text-gray-900">
                                  {formatCurrency(totalCredit)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default JournalEntryTable;
