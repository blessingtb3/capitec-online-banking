import type { PaymentScheduleRow } from '../types/loans';

/** Rounds to cents. */
export const roundToCents = (value: number): number => Math.round(value * 100) / 100;

/**
 * Standard amortising monthly repayment.
 * @param principal loan amount in rands
 * @param annualRatePercent e.g. 12.5 for 12.5% p.a.
 * @param termMonths number of monthly payments
 */
export function monthlyPayment(principal: number, annualRatePercent: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return roundToCents(principal / termMonths);
  return roundToCents((principal * r) / (1 - Math.pow(1 + r, -termMonths)));
}

/** Largest principal a monthly repayment can service (inverse of monthlyPayment). */
export function principalForPayment(payment: number, annualRatePercent: number, termMonths: number): number {
  if (payment <= 0 || termMonths <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return payment * termMonths;
  return (payment * (1 - Math.pow(1 + r, -termMonths))) / r;
}

/** Month-by-month split of each repayment into interest and principal. */
export function buildPaymentSchedule(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
): PaymentScheduleRow[] {
  const r = annualRatePercent / 100 / 12;
  const payment = monthlyPayment(principal, annualRatePercent, termMonths);
  const rows: PaymentScheduleRow[] = [];
  let balance = principal;

  for (let month = 1; month <= termMonths; month++) {
    const interest = roundToCents(balance * r);
    // The final payment clears whatever is left, absorbing rounding drift.
    const isLast = month === termMonths;
    const principalPart = isLast ? roundToCents(balance) : roundToCents(payment - interest);
    balance = isLast ? 0 : roundToCents(balance - principalPart);
    rows.push({
      month,
      payment: isLast ? roundToCents(principalPart + interest) : payment,
      principal: principalPart,
      interest,
      balance,
    });
  }
  return rows;
}
