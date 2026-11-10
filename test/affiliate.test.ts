import { describe, expect, it } from 'vitest';
import { insuranceBox } from '../src/lib/affiliate';

describe('insuranceBox', () => {
  it('unset: neutral text and no link', () => {
    for (const v of [undefined, '', '  ', 'not a url', 'javascript:alert(1)']) {
      const b = insuranceBox(v);
      expect(b.link).toBeNull();
      expect(b.text.length).toBeGreaterThan(20);
    }
  });
  it('set: Anzeige label and sponsored rel', () => {
    const b = insuranceBox('https://partner.example/hund?id=1');
    expect(b.link?.adLabel).toBe('Anzeige');
    expect(b.link?.rel).toBe('sponsored nofollow noopener');
    expect(b.link?.href).toBe('https://partner.example/hund?id=1');
  });
});
