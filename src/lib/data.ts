// Loads committed per-municipality records at build time. No network.
import type { MunicipalityRecord } from './model';

const modules = import.meta.glob<MunicipalityRecord>('../../data/nw/*.json', { eager: true, import: 'default' });

export function allRecords(): MunicipalityRecord[] {
  return Object.values(modules);
}
