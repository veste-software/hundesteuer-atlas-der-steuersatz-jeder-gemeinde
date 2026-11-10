import { describe, expect, it } from 'vitest';
import { coverageMarkdown, runHarvest } from '../pipeline/run';
import type { Municipality, MunicipalityRecord } from '../src/lib/model';

const mk = (i: number): Municipality => ({
  ags: `0577000${i}`, name: `Ort ${i}`, slug: `ort-${i}`, kreis: 'Kreis X', kreisSlug: 'kreis-x', population: 1000, website: null,
});
const list = Array.from({ length: 10 }, (_, i) => mk(i));

describe('runHarvest', () => {
  it('honours --limit and writes each result', async () => {
    const written: MunicipalityRecord[] = [];
    const r = await runHarvest(list, async (m) => ({ ...m, status: 'not-found' }), {
      limit: 5, maxMs: 1e9, now: () => 0, write: (x) => void written.push(x),
    });
    expect(r.done).toHaveLength(5);
    expect(written).toHaveLength(5);
    expect(r.timedOut).toBe(false);
  });

  it('stops starting new work when the time limit is reached (mocked clock)', async () => {
    let t = 0;
    const r = await runHarvest(list, async (m) => { t += 60_000; return { ...m, status: 'not-found' }; }, {
      maxMs: 180_000, concurrency: 1, now: () => t, write: () => {},
    });
    expect(r.done).toHaveLength(3);
    expect(r.timedOut).toBe(true);
    expect(r.skipped).toBe(7);
  });

  it('turns a thrown error into fetch-error', async () => {
    const r = await runHarvest(list.slice(0, 1), async () => { throw new Error('x'); }, {
      maxMs: 1e9, now: () => 0, write: () => {},
    });
    expect(r.done[0].status).toBe('fetch-error');
  });
});

describe('coverageMarkdown', () => {
  it('lists every municipality with its status', () => {
    const md = coverageMarkdown(list.slice(0, 2), [{ ...list[0], status: 'published' }]);
    expect(md).toContain('| 05770000 | Ort 0 | Kreis X | published |');
    expect(md).toContain('| 05770001 | Ort 1 | Kreis X | nicht bearbeitet |');
    expect(md).toContain('published: 1');
  });
});
