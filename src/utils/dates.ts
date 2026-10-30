/** Date helpers working on ISO "YYYY-MM-DD" strings, in UTC so results never shift by timezone. */

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
}

/** Adds calendar months, clamping to the last day of the target month. */
export function addMonths(iso: string, months: number): string {
  const date = parseIsoDate(iso);
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return toIsoDate(target);
}

/** Whole days from start to end, inclusive of both. */
export function daysBetweenInclusive(startIso: string, endIso: string): number {
  return Math.round((parseIsoDate(endIso).getTime() - parseIsoDate(startIso).getTime()) / 86_400_000) + 1;
}

export function isValidIsoDate(value: string): boolean {
  return ISO_DATE.test(value) && toIsoDate(parseIsoDate(value)) === value;
}
