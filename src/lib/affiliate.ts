export interface InsuranceBox {
  /** Neutral explanatory text, always shown. */
  text: string;
  /** Present only when an affiliate URL is configured. */
  link: { href: string; rel: string; label: string; adLabel: string } | null;
}

const NEUTRAL_TEXT =
  'Eine Hundehalter-Haftpflichtversicherung deckt Schäden ab, die Ihr Hund anderen zufügt. ' +
  'Ob sie für Ihren Hund vorgeschrieben ist, regelt das Landesrecht; fragen Sie im Zweifel Ihre Gemeinde.';

/** Only absolute https URLs are accepted; anything else behaves as "unset". */
export function insuranceBox(url: string | undefined | null): InsuranceBox {
  const trimmed = (url ?? '').trim();
  let valid = false;
  try {
    valid = new URL(trimmed).protocol === 'https:';
  } catch {
    valid = false;
  }
  if (!valid) return { text: NEUTRAL_TEXT, link: null };
  return {
    text: NEUTRAL_TEXT,
    link: { href: trimmed, rel: 'sponsored nofollow noopener', label: 'Haftpflicht für Hundehalter vergleichen', adLabel: 'Anzeige' },
  };
}
