// Rate model (SPEC §5). Plain types, no Astro imports, so Vitest and the pipeline can use them.

export type TierKind = 'nth-dog' | 'per-dog-when-n-kept' | 'dangerous' | 'large';

export interface Tier {
  /** Label exactly as in the bylaw. */
  label: string;
  kind: TierKind;
  /**
   * nth-dog: the dog number this amount applies to ("third and further" → 3).
   * per-dog-when-n-kept: the number of dogs kept that triggers this per-dog amount.
   * dangerous / large: usually 1.
   */
  n: number;
  amountEur: number;
}

export type Status = 'published' | 'found-unparsed' | 'scan' | 'not-found' | 'fetch-error';

export interface Bylaw {
  url: string;
  title: string;
  date: string | null;
  inForceFrom: string | null;
  retrievedAt: string;
  sha256: string;
  format: 'pdf' | 'html';
}

export interface Excerpt {
  paragraph: string;
  text: string;
}

export interface Relief {
  paragraph: string;
  heading: string;
  text: string;
}

export interface Municipality {
  ags: string;
  name: string;
  slug: string;
  kreis: string;
  kreisSlug: string;
  population: number | null;
  website: string | null;
}

export interface MunicipalityRecord extends Municipality {
  status: Status;
  bylaw?: Bylaw;
  tiers?: Tier[];
  excerpt?: Excerpt;
  reliefs?: Relief[];
  history?: { bylaw: Bylaw; tiers: Tier[] }[];
}
