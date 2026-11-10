import { describe, expect, it } from 'vitest';
import { parseArgs } from '../pipeline/harvest';

describe('harvest parseArgs', () => {
  it('reads --state, --limit and --max-minutes', () => {
    expect(parseArgs(['--state=nw', '--limit=5', '--max-minutes=3'])).toEqual({ state: 'NW', limit: 5, maxMinutes: 3 });
  });

  it('defaults to NRW, no limit, 30 minutes', () => {
    expect(parseArgs([])).toEqual({ state: 'NW', limit: undefined, maxMinutes: 30 });
  });
});
