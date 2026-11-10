// Harvest pipeline entry point: `npm run harvest -- --state=NW --limit=5 --max-minutes=3`.
// Scaffold stub: parses the flags and exits. The Builder implements discovery, text
// extraction, rate extraction, validation and change tracking (see SPEC.md §5 and PLAN.md).
// Never imported by the Astro build: `npm run build` reads only committed files under data/.
import { pathToFileURL } from 'node:url';

export interface HarvestOptions {
  state: string;
  limit: number | undefined;
  maxMinutes: number;
}

export function parseArgs(argv: string[]): HarvestOptions {
  const get = (name: string) => argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
  const limit = get('limit');
  return {
    state: (get('state') ?? 'NW').toUpperCase(),
    limit: limit ? Number(limit) : undefined,
    maxMinutes: Number(get('max-minutes') ?? 30),
  };
}

const isMain = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const opts = parseArgs(process.argv.slice(2));
  console.log(`harvest: state=${opts.state} limit=${opts.limit ?? 'all'} max-minutes=${opts.maxMinutes}`);
  console.log('harvest: pipeline not implemented yet (scaffold stub).');
}
