/**
 * Display formatting. Done by hand (rather than Intl 'en-ZA') because the
 * en-ZA decimal separator differs between browsers and Node/ICU builds,
 * which makes output and tests inconsistent.
 */

const NBSP = ' ';

const groupThousands = (whole: number): string =>
  whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);

/** 4250.75 → "R4 250.75"; with { decimals: false } → "R4 251". */
export function formatCurrency(amount: number, { decimals = true } = {}): string {
  const sign = amount < 0 ? '−' : '';
  const abs = Math.abs(amount);
  if (!decimals) return `${sign}R${groupThousands(Math.round(abs))}`;
  const cents = Math.round(abs * 100);
  const whole = Math.floor(cents / 100);
  const fraction = String(cents % 100).padStart(2, '0');
  return `${sign}R${groupThousands(whole)}.${fraction}`;
}

/** 12.5 → "+12.5%", -3.2 → "−3.2%" (values are already percentages). */
export function formatChange(percent: number): string {
  const rounded = Math.round(percent * 10) / 10;
  if (rounded === 0) return '0%';
  return `${rounded > 0 ? '+' : '−'}${Math.abs(rounded)}%`;
}

/** 12.5 → "12.5%". */
export function formatPercent(percent: number, decimals = 1): string {
  return `${percent.toFixed(decimals)}%`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2024-09-16" or "2024-09-16T14:30:00Z" → "16 Sep 2024". */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** "2024-06" → "Jun 2024", or "Jun" with { short: true }. */
export function formatMonth(yearMonth: string, { short = false } = {}): string {
  const [year, month] = yearMonth.split('-').map(Number);
  return short ? MONTHS[month - 1] : `${MONTHS[month - 1]} ${year}`;
}

/** "home_improvement" → "Home improvement". */
export function humanise(value: string): string {
  const text = value.replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}
