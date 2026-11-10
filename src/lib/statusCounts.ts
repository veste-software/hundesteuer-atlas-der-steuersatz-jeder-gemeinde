// Status counts for /methodik/ (AC 16), read from the committed records.
import type { MunicipalityRecord, Status } from './model';

export const STATUSES: Status[] = ['published', 'found-unparsed', 'scan', 'not-found', 'fetch-error'];

export const STATUS_LABELS: Record<Status, string> = {
  published: 'Veröffentlicht',
  'found-unparsed': 'Satzung gefunden, nicht sicher lesbar',
  scan: 'Satzung nur als Scan',
  'not-found': 'Keine Satzung gefunden',
  'fetch-error': 'Abruf fehlgeschlagen',
};

export function statusCounts(records: Pick<MunicipalityRecord, 'status'>[]): Record<Status, number> {
  const out = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<Status, number>;
  for (const r of records) if (r.status in out) out[r.status] += 1;
  return out;
}
