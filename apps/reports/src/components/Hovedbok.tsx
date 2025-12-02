import { useState, useMemo } from 'react';
import { kontoplan } from '../data/kontoplan';
import { Bilagstabell } from './Bilagstabell';
import { Kategori, Bilag, Bilagstype, Periode } from '../types/ledger';

// Fargekart for kategorier
const kategorifarger: Record<string, { bg: string; tekst: string; border: string; accent: string }> = {
  blue: { bg: 'bg-blue-50', tekst: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-500' },
  green: { bg: 'bg-green-50', tekst: 'text-green-700', border: 'border-green-200', accent: 'bg-green-500' },
  red: { bg: 'bg-red-50', tekst: 'text-red-700', border: 'border-red-200', accent: 'bg-red-500' },
  emerald: { bg: 'bg-emerald-50', tekst: 'text-emerald-700', border: 'border-emerald-200', accent: 'bg-emerald-500' },
  orange: { bg: 'bg-orange-50', tekst: 'text-orange-700', border: 'border-orange-200', accent: 'bg-orange-500' },
  violet: { bg: 'bg-violet-50', tekst: 'text-violet-700', border: 'border-violet-200', accent: 'bg-violet-500' },
  amber: { bg: 'bg-amber-50', tekst: 'text-amber-700', border: 'border-amber-200', accent: 'bg-amber-500' },
  slate: { bg: 'bg-slate-50', tekst: 'text-slate-700', border: 'border-slate-200', accent: 'bg-slate-500' },
};

// Demo-data
const lagDemoBilag = (): Bilag[] => {
  return [
    {
      bilagsnummer: 'B-2024-001',
      bilagstype: 'salg',
      dato: '2024-01-15',
      kundeId: 'K-001',
      referanse: 'Faktura 1001',
      opprettetDato: '2024-01-15T10:30:00',
      opprettetAv: 'Ole Hansen',
      erKrysset: false,
      erApen: false,
      prosjektId: 'P-001',
      linjer: [
        { linjeId: '1', kontoId: '1500', kontonavn: 'Kundefordringer', debet: 12500, kredit: null, belop: 12500, mvaKode: '0', mvaBelop: 0, beskrivelse: 'Faktura til kunde' },
        { linjeId: '2', kontoId: '3000', kontonavn: 'Salgsinntekt, avgiftspliktig', debet: null, kredit: 10000, belop: 10000, mvaKode: '1', mvaBelop: 2500, beskrivelse: 'Salg av konsulenttjenester' },
        { linjeId: '3', kontoId: '2700', kontonavn: 'Utgående merverdiavgift', debet: null, kredit: 2500, belop: 2500, mvaKode: '1', mvaBelop: 2500, beskrivelse: 'MVA 25%' },
      ],
    },
    {
      bilagsnummer: 'B-2024-002',
      bilagstype: 'kjop',
      dato: '2024-01-18',
      leverandorId: 'L-005',
      referanse: 'Leverandørfaktura 5521',
      dokumentUrl: '/dokumenter/kvitteringer/5521.pdf',
      opprettetDato: '2024-01-18T14:15:00',
      opprettetAv: 'Kari Olsen',
      erKrysset: true,
      erApen: false,
      linjer: [
        { linjeId: '1', kontoId: '6800', kontonavn: 'Kontorrekvisita', debet: 2400, kredit: null, belop: 2400, mvaKode: '3', mvaBelop: 600, beskrivelse: 'Kontormateriell' },
        { linjeId: '2', kontoId: '2710', kontonavn: 'Inngående merverdiavgift', debet: 600, kredit: null, belop: 600, mvaKode: '3', mvaBelop: 600, beskrivelse: 'MVA 25%' },
        { linjeId: '3', kontoId: '2400', kontonavn: 'Leverandørgjeld', debet: null, kredit: 3000, belop: 3000, mvaKode: '0', mvaBelop: 0, beskrivelse: 'Skyldig leverandør' },
      ],
    },
    {
      bilagsnummer: 'B-2024-003',
      bilagstype: 'bank',
      dato: '2024-01-20',
      referanse: 'Bankoverføring',
      opprettetDato: '2024-01-20T09:00:00',
      opprettetAv: 'System',
      erKrysset: false,
      erApen: true,
      linjer: [
        { linjeId: '1', kontoId: '1920', kontonavn: 'Bankinnskudd', debet: 12500, kredit: null, belop: 12500, mvaKode: '0', mvaBelop: 0, beskrivelse: 'Innbetaling fra kunde' },
        { linjeId: '2', kontoId: '1500', kontonavn: 'Kundefordringer', debet: null, kredit: 12500, belop: 12500, mvaKode: '0', mvaBelop: 0, beskrivelse: 'Motregning kundefordring' },
      ],
    },
    {
      bilagsnummer: 'B-2024-004',
      bilagstype: 'lonn',
      dato: '2024-01-31',
      referanse: 'Lønnskjøring januar',
      opprettetDato: '2024-01-31T12:00:00',
      opprettetAv: 'Kari Olsen',
      erKrysset: false,
      erApen: false,
      linjer: [
        { linjeId: '1', kontoId: '5000', kontonavn: 'Lønn til ansatte', debet: 45000, kredit: null, belop: 45000, mvaKode: '0', mvaBelop: 0, beskrivelse: 'Bruttolønn' },
        { linjeId: '2', kontoId: '5400', kontonavn: 'Arbeidsgiveravgift', debet: 6345, kredit: null, belop: 6345, mvaKode: '0', mvaBelop: 0, beskrivelse: 'AGA 14.1%' },
        { linjeId: '3', kontoId: '2600', kontonavn: 'Skattetrekk', debet: null, kredit: 13500, belop: 13500, mvaKode: '0', mvaBelop: 0, beskrivelse: 'Forskuddstrekk' },
        { linjeId: '4', kontoId: '2770', kontonavn: 'Skyldig arbeidsgiveravgift', debet: null, kredit: 6345, belop: 6345, mvaKode: '0', mvaBelop: 0, beskrivelse: 'Skyldig AGA' },
        { linjeId: '5', kontoId: '2920', kontonavn: 'Skyldig lønn', debet: null, kredit: 31500, belop: 31500, mvaKode: '0', mvaBelop: 0, beskrivelse: 'Nettolønn til utbetaling' },
      ],
    },
    {
      bilagsnummer: 'B-2024-005',
      bilagstype: 'kjop',
      dato: '2024-02-05',
      leverandorId: 'L-012',
      referanse: 'Faktura 8842',
      opprettetDato: '2024-02-05T11:00:00',
      opprettetAv: 'Ole Hansen',
      erKrysset: false,
      erApen: true,
      linjer: [
        { linjeId: '1', kontoId: '6940', kontonavn: 'Programvare og lisenser', debet: 4800, kredit: null, belop: 4800, mvaKode: '3', mvaBelop: 1200, beskrivelse: 'Årsabonnement regnskapssystem' },
        { linjeId: '2', kontoId: '2710', kontonavn: 'Inngående merverdiavgift', debet: 1200, kredit: null, belop: 1200, mvaKode: '3', mvaBelop: 1200, beskrivelse: 'MVA 25%' },
        { linjeId: '3', kontoId: '2400', kontonavn: 'Leverandørgjeld', debet: null, kredit: 6000, belop: 6000, mvaKode: '0', mvaBelop: 0, beskrivelse: 'Skyldig leverandør' },
      ],
    },
  ];
};

// Hent alle kontoer som har bilag
const hentKontoerMedBilag = (bilag: Bilag[]): Set<string> => {
  const kontoer = new Set<string>();
  bilag.forEach(b => {
    b.linjer.forEach(linje => {
      kontoer.add(linje.kontoId);
    });
  });
  return kontoer;
};

// Hent alle unike kontoer fra kontoplanen (for filter dropdown)
const hentAlleKontoer = (): { kontoId: string; navn: string }[] => {
  const kontoer: { kontoId: string; navn: string }[] = [];
  kontoplan.forEach(kategori => {
    kategori.underkategorier.forEach(under => {
      under.kontoer.forEach(konto => {
        kontoer.push({ kontoId: konto.kontoId, navn: konto.navn });
      });
    });
  });
  return kontoer.sort((a, b) => a.kontoId.localeCompare(b.kontoId));
};

interface FilterlinjeProps {
  periode: Periode;
  onPeriodeEndring: (periode: Periode) => void;
  bilagstype: Bilagstype | '';
  onBilagstypeEndring: (type: Bilagstype | '') => void;
  kontoId: string;
  onKontoEndring: (kontoId: string) => void;
  kryssmodus: 'alle' | 'apne';
  onKryssmodusEndring: (modus: 'alle' | 'apne') => void;
  visKryssing: boolean;
  onVisKryssingEndring: (vis: boolean) => void;
  kontoerMedBilag: Set<string>;
}

function Filterlinje({
  periode,
  onPeriodeEndring,
  bilagstype,
  onBilagstypeEndring,
  kontoId,
  onKontoEndring,
  kryssmodus,
  onKryssmodusEndring,
  visKryssing,
  onVisKryssingEndring,
  kontoerMedBilag,
}: FilterlinjeProps) {
  const innevarendeAr = new Date().getFullYear();
  const ar = Array.from({ length: 5 }, (_, i) => innevarendeAr - i);
  const maneder = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ];

  const bilagstyper: { verdi: Bilagstype | ''; etikett: string }[] = [
    { verdi: '', etikett: 'Alle typer' },
    { verdi: 'salg', etikett: 'Salg' },
    { verdi: 'kjop', etikett: 'Kjøp' },
    { verdi: 'lonn', etikett: 'Lønn' },
    { verdi: 'bank', etikett: 'Bank' },
    { verdi: 'journal', etikett: 'Journalføring' },
    { verdi: 'avskrivning', etikett: 'Avskrivning' },
    { verdi: 'justering', etikett: 'Justering' },
  ];

  // Vis kun kontoer som har bilag i dropdown
  const alleKontoer = hentAlleKontoer();
  const tilgjengeligeKontoer = alleKontoer.filter(k => kontoerMedBilag.has(k.kontoId));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Periode */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Periode:</label>
          <select
            value={periode.maned}
            onChange={(e) => onPeriodeEndring({ ...periode, maned: Number(e.target.value) })}
            className="rounded-md border-gray-300 text-sm focus:border-purple-500 focus:ring-purple-500"
          >
            {maneder.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={periode.ar}
            onChange={(e) => onPeriodeEndring({ ...periode, ar: Number(e.target.value) })}
            className="rounded-md border-gray-300 text-sm focus:border-purple-500 focus:ring-purple-500"
          >
            {ar.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Bilagstype */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Bilagstype:</label>
          <select
            value={bilagstype}
            onChange={(e) => onBilagstypeEndring(e.target.value as Bilagstype | '')}
            className="rounded-md border-gray-300 text-sm focus:border-purple-500 focus:ring-purple-500"
          >
            {bilagstyper.map((bt) => (
              <option key={bt.verdi} value={bt.verdi}>{bt.etikett}</option>
            ))}
          </select>
        </div>

        {/* Konto */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Konto:</label>
          <select
            value={kontoId}
            onChange={(e) => onKontoEndring(e.target.value)}
            className="rounded-md border-gray-300 text-sm focus:border-purple-500 focus:ring-purple-500 max-w-[220px]"
          >
            <option value="">Alle kontoer</option>
            {tilgjengeligeKontoer.map((konto) => (
              <option key={konto.kontoId} value={konto.kontoId}>
                {konto.kontoId} – {konto.navn}
              </option>
            ))}
          </select>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-gray-200 mx-2" />

        {/* Kryssing */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onVisKryssingEndring(!visKryssing)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              visKryssing
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Kryss bilag
          </button>

          {visKryssing && (
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => onKryssmodusEndring('alle')}
                className={`px-3 py-1.5 text-sm font-medium rounded-l-md border ${
                  kryssmodus === 'alle'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Alle bilag
              </button>
              <button
                onClick={() => onKryssmodusEndring('apne')}
                className={`px-3 py-1.5 text-sm font-medium rounded-r-md border-t border-r border-b -ml-px ${
                  kryssmodus === 'apne'
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

interface KontoRadProps {
  kontoId: string;
  kontonavn: string;
  bilag: Bilag[];
  visKryssing: boolean;
  onKryssingEndring: (bilagsnummer: string, erKrysset: boolean) => void;
  kategorifarge: string;
}

function KontoRad({ kontoId, kontonavn, bilag, visKryssing, onKryssingEndring, kategorifarge }: KontoRadProps) {
  const [erUtvidet, setErUtvidet] = useState(false);
  const farger = kategorifarger[kategorifarge] || kategorifarger.slate;

  // Beregn sum debet og kredit for denne kontoen
  const summer = useMemo(() => {
    let debet = 0;
    let kredit = 0;
    bilag.forEach(b => {
      b.linjer.forEach(linje => {
        if (linje.kontoId === kontoId) {
          debet += linje.debet || 0;
          kredit += linje.kredit || 0;
        }
      });
    });
    return { debet, kredit, saldo: debet - kredit };
  }, [bilag, kontoId]);

  const formaterBelop = (belop: number) => {
    return new Intl.NumberFormat('nb-NO', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(belop);
  };

  if (bilag.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setErUtvidet(!erUtvidet)}
        className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${erUtvidet ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className={`font-mono text-sm px-2 py-0.5 rounded ${farger.bg} ${farger.tekst}`}>
            {kontoId}
          </span>
          <span className="text-sm text-gray-700">
            {kontonavn}
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="text-right">
            <span className="text-gray-500 mr-2">Debet:</span>
            <span className="font-mono text-gray-900">{formaterBelop(summer.debet)}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-500 mr-2">Kredit:</span>
            <span className="font-mono text-gray-900">{formaterBelop(summer.kredit)}</span>
          </div>
          <div className="text-right min-w-[100px]">
            <span className="text-gray-500 mr-2">Saldo:</span>
            <span className={`font-mono font-medium ${summer.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formaterBelop(Math.abs(summer.saldo))}
            </span>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            {bilag.length} bilag
          </span>
        </div>
      </button>

      {erUtvidet && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <Bilagstabell
            bilag={bilag}
            onKryssingEndring={onKryssingEndring}
            visKontoKolonne={false}
            visKryssingCheckbox={visKryssing}
          />
        </div>
      )}
    </div>
  );
}

interface KategoriAccordionProps {
  kategori: Kategori;
  erUtvidet: boolean;
  onToggle: () => void;
  bilag: Bilag[];
  visKryssing: boolean;
  onKryssingEndring: (bilagsnummer: string, erKrysset: boolean) => void;
  valgtKontoId: string;
  kontoerMedBilag: Set<string>;
}

function KategoriAccordion({
  kategori,
  erUtvidet,
  onToggle,
  bilag,
  visKryssing,
  onKryssingEndring,
  valgtKontoId,
  kontoerMedBilag,
}: KategoriAccordionProps) {
  const farger = kategorifarger[kategori.farge] || kategorifarger.slate;

  // Hent alle kontoIDer i denne kategorien som har bilag
  const kategoriKontoer = useMemo(() => {
    const kontoer: { kontoId: string; navn: string }[] = [];
    kategori.underkategorier.forEach(under => {
      under.kontoer.forEach(konto => {
        if (kontoerMedBilag.has(konto.kontoId)) {
          kontoer.push({ kontoId: konto.kontoId, navn: konto.navn });
        }
      });
    });
    return kontoer;
  }, [kategori, kontoerMedBilag]);

  // Hvis en spesifikk konto er valgt, vis bare den
  const synligeKontoer = useMemo(() => {
    if (valgtKontoId) {
      return kategoriKontoer.filter(k => k.kontoId === valgtKontoId);
    }
    return kategoriKontoer;
  }, [kategoriKontoer, valgtKontoId]);

  // Ikke vis kategorien hvis den ikke har noen kontoer med bilag
  if (synligeKontoer.length === 0) {
    return null;
  }

  // Tell bilag i denne kategorien
  const kategoriBilagAntall = useMemo(() => {
    const kontoIder = new Set(synligeKontoer.map(k => k.kontoId));
    return bilag.filter(b =>
      b.linjer.some(linje => kontoIder.has(linje.kontoId))
    ).length;
  }, [bilag, synligeKontoer]);

  // Hent bilag for en spesifikk konto
  const hentKontoBilag = (kontoId: string) => {
    return bilag.filter(b =>
      b.linjer.some(linje => linje.kontoId === kontoId)
    );
  };

  return (
    <div className={`border ${farger.border} rounded-lg overflow-hidden mb-4`}>
      {/* Kategori-header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 ${farger.bg} hover:opacity-95 transition-all`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-12 rounded-full ${farger.accent}`} />
          <div className="text-left">
            <h3 className={`text-lg font-semibold ${farger.tekst}`}>
              {kategori.navn}
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">
              {kategori.beskrivelse}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-mono bg-white/50 px-2 py-1 rounded">
            {kategori.kontoRange}
          </span>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-white/80 ${farger.tekst}`}>
            {kategoriBilagAntall} bilag
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${erUtvidet ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Innhold - liste over kontoer med bilag */}
      {erUtvidet && (
        <div className="bg-white divide-y divide-gray-100">
          {synligeKontoer.map(konto => (
            <KontoRad
              key={konto.kontoId}
              kontoId={konto.kontoId}
              kontonavn={konto.navn}
              bilag={hentKontoBilag(konto.kontoId)}
              visKryssing={visKryssing}
              onKryssingEndring={onKryssingEndring}
              kategorifarge={kategori.farge}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Hovedbok() {
  const dagsDato = new Date();

  // Filter-state
  const [periode, setPeriode] = useState<Periode>({ maned: dagsDato.getMonth() + 1, ar: dagsDato.getFullYear() });
  const [bilagstype, setBilagstype] = useState<Bilagstype | ''>('');
  const [kontoId, setKontoId] = useState('');
  const [kryssmodus, setKryssmodus] = useState<'alle' | 'apne'>('alle');
  const [visKryssing, setVisKryssing] = useState(false);

  // Accordion state
  const [utvideteKategorier, setUtvideteKategorier] = useState<Set<string>>(new Set());

  // Data
  const [bilag, setBilag] = useState<Bilag[]>(lagDemoBilag());

  // Kontoer med bilag
  const kontoerMedBilag = useMemo(() => hentKontoerMedBilag(bilag), [bilag]);

  // Filtrer bilag
  const filtrerteBilag = useMemo(() => {
    let resultat = [...bilag];

    // Filtrer på bilagstype
    if (bilagstype) {
      resultat = resultat.filter(b => b.bilagstype === bilagstype);
    }

    // Filtrer på konto
    if (kontoId) {
      resultat = resultat.filter(b =>
        b.linjer.some(linje => linje.kontoId === kontoId)
      );
    }

    // Filtrer på åpne poster når kryssing er aktivert
    if (visKryssing && kryssmodus === 'apne') {
      resultat = resultat.filter(b => b.erApen);
    }

    // Filtrer på år (for demo)
    resultat = resultat.filter(b => {
      const dato = new Date(b.dato);
      return dato.getFullYear() === periode.ar;
    });

    return resultat;
  }, [bilag, bilagstype, kontoId, visKryssing, kryssmodus, periode]);

  // Oppdater kontoer med bilag basert på filtrerte bilag
  const filtrertKontoerMedBilag = useMemo(() => hentKontoerMedBilag(filtrerteBilag), [filtrerteBilag]);

  // Toggle kategori
  const toggleKategori = (kategoriId: string) => {
    setUtvideteKategorier(prev => {
      const neste = new Set(prev);
      if (neste.has(kategoriId)) {
        neste.delete(kategoriId);
      } else {
        neste.add(kategoriId);
      }
      return neste;
    });
  };

  // Håndter kryssing
  const haandterKryssingEndring = (bilagsnummer: string, erKrysset: boolean) => {
    setBilag(prev =>
      prev.map(b => (b.bilagsnummer === bilagsnummer ? { ...b, erKrysset } : b))
    );
  };

  // Utvid/lukk alle
  const utvidAlle = () => {
    setUtvideteKategorier(new Set(kontoplan.map(k => k.id)));
  };

  const lukkAlle = () => {
    setUtvideteKategorier(new Set());
  };

  // Tell statistikk
  const kryssetAntall = bilag.filter(b => b.erKrysset).length;
  const apneAntall = bilag.filter(b => b.erApen).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hovedbok</h1>
        <p className="mt-2 text-gray-600">
          Oversikt over alle kontoer og bilag i regnskapet
        </p>
      </div>

      {/* Filterlinje */}
      <Filterlinje
        periode={periode}
        onPeriodeEndring={setPeriode}
        bilagstype={bilagstype}
        onBilagstypeEndring={setBilagstype}
        kontoId={kontoId}
        onKontoEndring={setKontoId}
        kryssmodus={kryssmodus}
        onKryssmodusEndring={setKryssmodus}
        visKryssing={visKryssing}
        onVisKryssingEndring={setVisKryssing}
        kontoerMedBilag={kontoerMedBilag}
      />

      {/* Statuslinje */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{filtrerteBilag.length} bilag</span>
          {visKryssing && (
            <>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {kryssetAntall} krysset
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                {apneAntall} åpne poster
              </span>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={utvidAlle}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Utvid alle
          </button>
          <button
            onClick={lukkAlle}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Lukk alle
          </button>
        </div>
      </div>

      {/* Kategori-accordion */}
      <div>
        {kontoplan.map(kategori => (
          <KategoriAccordion
            key={kategori.id}
            kategori={kategori}
            erUtvidet={utvideteKategorier.has(kategori.id)}
            onToggle={() => toggleKategori(kategori.id)}
            bilag={filtrerteBilag}
            visKryssing={visKryssing}
            onKryssingEndring={haandterKryssingEndring}
            valgtKontoId={kontoId}
            kontoerMedBilag={filtrertKontoerMedBilag}
          />
        ))}
      </div>

      {/* Tom tilstand */}
      {filtrerteBilag.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">Ingen bilag funnet for valgt periode</p>
        </div>
      )}
    </div>
  );
}

export default Hovedbok;
