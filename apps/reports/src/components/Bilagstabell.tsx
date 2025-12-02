import { useState } from 'react';
import { Bilag, Bilagstype } from '../types/ledger';

interface BilagstabellProps {
  bilag: Bilag[];
  onKryssingEndring?: (bilagsnummer: string, erKrysset: boolean) => void;
  visKontoKolonne?: boolean;
  visKryssingCheckbox?: boolean;
}

const bilagstypeEtiketter: Record<Bilagstype, string> = {
  salg: 'Salg',
  kjop: 'Kjøp',
  lonn: 'Lønn',
  bank: 'Bank',
  journal: 'Journal',
  avskrivning: 'Avskr.',
  justering: 'Just.',
};

const bilagstypeFarger: Record<Bilagstype, string> = {
  salg: 'bg-green-100 text-green-700',
  kjop: 'bg-blue-100 text-blue-700',
  lonn: 'bg-purple-100 text-purple-700',
  bank: 'bg-cyan-100 text-cyan-700',
  journal: 'bg-gray-100 text-gray-700',
  avskrivning: 'bg-orange-100 text-orange-700',
  justering: 'bg-yellow-100 text-yellow-700',
};

export function Bilagstabell({
  bilag,
  onKryssingEndring,
  visKontoKolonne = true,
  visKryssingCheckbox = false,
}: BilagstabellProps) {
  const [utvidedeBilag, setUtvidedeBilag] = useState<Set<string>>(new Set());

  const toggleUtvid = (bilagsnummer: string) => {
    setUtvidedeBilag((prev) => {
      const neste = new Set(prev);
      if (neste.has(bilagsnummer)) {
        neste.delete(bilagsnummer);
      } else {
        neste.add(bilagsnummer);
      }
      return neste;
    });
  };

  const formaterDato = (datoStreng: string) => {
    const dato = new Date(datoStreng);
    return dato.toLocaleDateString('nb-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formaterBelop = (belop: number | null) => {
    if (belop === null || belop === 0) return '';
    return new Intl.NumberFormat('nb-NO', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(belop);
  };

  if (bilag.length === 0) {
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
            {visKryssingCheckbox && (
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
            {visKontoKolonne && (
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
          {bilag.map((b) => {
            const erUtvidet = utvidedeBilag.has(b.bilagsnummer);
            const totalDebet = b.linjer.reduce((sum, linje) => sum + (linje.debet || 0), 0);
            const totalKredit = b.linjer.reduce((sum, linje) => sum + (linje.kredit || 0), 0);
            const forsteLinje = b.linjer[0];

            return (
              <>
                {/* Hoved-bilagsrad */}
                <tr
                  key={b.bilagsnummer}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    erUtvidet ? 'bg-purple-50' : ''
                  } ${b.erKrysset ? 'bg-green-50/50' : ''}`}
                  onClick={() => toggleUtvid(b.bilagsnummer)}
                >
                  {visKryssingCheckbox && (
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={b.erKrysset}
                          onChange={(e) => {
                            onKryssingEndring?.(b.bilagsnummer, e.target.checked);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        {b.erKrysset && (
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
                        className={`w-4 h-4 transition-transform ${erUtvidet ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">
                    {b.bilagsnummer}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600">
                    {formaterDato(b.dato)}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${bilagstypeFarger[b.bilagstype]}`}>
                      {bilagstypeEtiketter[b.bilagstype]}
                    </span>
                  </td>
                  {visKontoKolonne && (
                    <td className="px-3 py-3 text-sm text-gray-600">
                      {forsteLinje && (
                        <span>
                          <span className="font-mono text-gray-900">{forsteLinje.kontoId}</span>
                          {' '}
                          <span className="text-gray-500">{forsteLinje.kontonavn}</span>
                        </span>
                      )}
                      {b.linjer.length > 1 && (
                        <span className="ml-1 text-xs text-gray-400">
                          (+{b.linjer.length - 1})
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-3 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {forsteLinje?.beskrivelse || b.referanse || '—'}
                  </td>
                  <td className="px-3 py-3 text-sm text-right font-mono text-gray-900">
                    {formaterBelop(totalDebet)}
                  </td>
                  <td className="px-3 py-3 text-sm text-right font-mono text-gray-900">
                    {formaterBelop(totalKredit)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {b.erApen ? (
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
                    {b.dokumentUrl ? (
                      <a
                        href={b.dokumentUrl}
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

                {/* Utvidet detalj-visning */}
                {erUtvidet && (
                  <tr key={`${b.bilagsnummer}-detaljer`}>
                    <td colSpan={visKryssingCheckbox ? (visKontoKolonne ? 12 : 11) : (visKontoKolonne ? 11 : 10)} className="px-0 py-0">
                      <div className="bg-gray-50 border-l-4 border-purple-400 mx-4 my-2 rounded-r shadow-sm">
                        <div className="px-4 py-3">
                          {/* Bilagsmetadata */}
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-4 pb-3 border-b border-gray-200">
                            <div>
                              <span className="text-gray-500">Opprettet:</span>{' '}
                              <span className="text-gray-900">{formaterDato(b.opprettetDato)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Av:</span>{' '}
                              <span className="text-gray-900">{b.opprettetAv}</span>
                            </div>
                            {b.referanse && (
                              <div>
                                <span className="text-gray-500">Referanse:</span>{' '}
                                <span className="text-gray-900">{b.referanse}</span>
                              </div>
                            )}
                            {(b.kundeId || b.leverandorId) && (
                              <div>
                                <span className="text-gray-500">{b.kundeId ? 'Kunde:' : 'Leverandør:'}</span>{' '}
                                <span className="text-gray-900">{b.kundeId || b.leverandorId}</span>
                              </div>
                            )}
                            {b.prosjektId && (
                              <div>
                                <span className="text-gray-500">Prosjekt:</span>{' '}
                                <span className="text-gray-900">{b.prosjektId}</span>
                              </div>
                            )}
                            {b.valuta && b.valuta !== 'NOK' && (
                              <div>
                                <span className="text-gray-500">Valuta:</span>{' '}
                                <span className="text-gray-900">{b.valuta}</span>
                              </div>
                            )}
                            {b.erKrysset && (
                              <div className="flex items-center gap-1 text-green-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Krysset
                              </div>
                            )}
                          </div>

                          {/* Posteringslinjer */}
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
                              {b.linjer.map((linje) => (
                                <tr key={linje.linjeId} className="hover:bg-gray-50">
                                  <td className="px-3 py-2 text-sm text-gray-500 font-mono">
                                    {linje.linjeId}
                                  </td>
                                  <td className="px-3 py-2 text-sm">
                                    <span className="font-mono text-gray-900">{linje.kontoId}</span>
                                    {' '}
                                    <span className="text-gray-500">{linje.kontonavn}</span>
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-600">
                                    {linje.beskrivelse || '—'}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-600 font-mono">
                                    {linje.mvaKode !== '0' ? linje.mvaKode : '—'}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-right font-mono text-gray-600">
                                    {linje.mvaBelop > 0 ? formaterBelop(linje.mvaBelop) : '—'}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-right font-mono text-gray-900">
                                    {formaterBelop(linje.debet)}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-right font-mono text-gray-900">
                                    {formaterBelop(linje.kredit)}
                                  </td>
                                </tr>
                              ))}
                              {/* Sum-rad */}
                              <tr className="bg-gray-50 font-medium">
                                <td colSpan={5} className="px-3 py-2 text-sm text-right text-gray-700">
                                  Sum:
                                </td>
                                <td className="px-3 py-2 text-sm text-right font-mono text-gray-900">
                                  {formaterBelop(totalDebet)}
                                </td>
                                <td className="px-3 py-2 text-sm text-right font-mono text-gray-900">
                                  {formaterBelop(totalKredit)}
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

export default Bilagstabell;
