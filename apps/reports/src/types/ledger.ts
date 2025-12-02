// Typer for Hovedbok etter norsk regnskapsstandard (NS 4102)

export type Bilagstype =
  | 'salg'          // Salgsfaktura
  | 'kjop'          // Leverandørfaktura
  | 'lonn'          // Lønnskjøring
  | 'bank'          // Bankbevegelse
  | 'journal'       // Manuell journalføring
  | 'avskrivning'   // Avskrivning
  | 'justering';    // Korrigering

export type MVAKode =
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

export interface Posteringslinje {
  linjeId: string;
  kontoId: string;
  kontonavn: string;
  debet: number | null;
  kredit: number | null;
  belop: number;
  mvaKode: MVAKode;
  mvaBelop: number;
  beskrivelse: string;
}

export interface Bilag {
  bilagsnummer: string;
  bilagstype: Bilagstype;
  dato: string;
  linjer: Posteringslinje[];
  kundeId?: string;
  leverandorId?: string;
  dokumentUrl?: string;
  opprettetDato: string;
  opprettetAv: string;
  prosjektId?: string;
  valuta?: string;
  referanse?: string;
  erKrysset: boolean;
  erApen: boolean;
}

export interface Konto {
  kontoId: string;
  navn: string;
  beskrivelse?: string;
}

export interface Underkategori {
  id: string;
  navn: string;
  kontoer: Konto[];
}

export interface Kategori {
  id: string;
  navn: string;
  beskrivelse: string;
  kontoRange: string;
  underkategorier: Underkategori[];
  farge: string;
}

export interface Periode {
  maned: number;
  ar: number;
}
