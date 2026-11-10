import { describe, expect, it } from 'vitest';
import { statusCounts } from '../src/lib/statusCounts';

describe('statusCounts', () => {
  it('counts every status and zero-fills the rest', () => {
    const c = statusCounts([{ status: 'published' }, { status: 'published' }, { status: 'scan' }]);
    expect(c).toEqual({ published: 2, 'found-unparsed': 0, scan: 1, 'not-found': 0, 'fetch-error': 0 });
  });
  it('handles an empty dataset', () => {
    expect(statusCounts([]).published).toBe(0);
  });
});
