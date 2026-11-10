// Harvest orchestration core: worker pool with a time limit and a result limit.
// Pure of network and disk: `processOne` and `write` are injected so tests can mock them.
import type { Municipality, MunicipalityRecord, Status } from '../src/lib/model';

export interface RunOptions {
  limit?: number;
  maxMs: number;
  /** Municipalities processed in parallel (each host is rate-limited by the polite fetcher). */
  concurrency?: number;
  now: () => number;
  write: (record: MunicipalityRecord) => Promise<void> | void;
}

export interface RunResult {
  done: MunicipalityRecord[];
  skipped: number;
  timedOut: boolean;
}

export async function runHarvest(
  list: Municipality[],
  processOne: (m: Municipality) => Promise<MunicipalityRecord>,
  opts: RunOptions,
): Promise<RunResult> {
  const queue = list.slice(0, opts.limit ?? list.length);
  const start = opts.now();
  const done: MunicipalityRecord[] = [];
  let timedOut = false;
  let next = 0;
  const worker = async () => {
    while (next < queue.length) {
      if (opts.now() - start >= opts.maxMs) {
        timedOut = true;
        return;
      }
      const m = queue[next++];
      let record: MunicipalityRecord;
      try {
        record = await processOne(m);
      } catch {
        record = { ...m, status: 'fetch-error' };
      }
      await opts.write(record);
      done.push(record);
    }
  };
  const n = Math.max(1, Math.min(opts.concurrency ?? 12, queue.length));
  await Promise.all(Array.from({ length: n }, worker));
  return { done, skipped: queue.length - done.length, timedOut };
}

const STATUSES: Status[] = ['published', 'found-unparsed', 'scan', 'not-found', 'fetch-error'];

/** data/coverage-nw.md: one line per municipality, "nicht bearbeitet" when no record exists. */
export function coverageMarkdown(list: Municipality[], records: MunicipalityRecord[]): string {
  const byAgs = new Map(records.map((r) => [r.ags, r]));
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<Status, number>;
  for (const r of records) counts[r.status]++;
  const lines = [
    '# Abdeckung NRW',
    '',
    `Gemeinden: ${list.length}. ` + STATUSES.map((s) => `${s}: ${counts[s]}`).join(', ') + '.',
    '',
    '| AGS | Gemeinde | Kreis | Status |',
    '|---|---|---|---|',
    ...list.map((m) => `| ${m.ags} | ${m.name} | ${m.kreis} | ${byAgs.get(m.ags)?.status ?? 'nicht bearbeitet'} |`),
    '',
  ];
  return lines.join('\n');
}
