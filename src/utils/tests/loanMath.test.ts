import { buildPaymentSchedule, monthlyPayment, principalForPayment } from '../loanMath';

describe('monthlyPayment', () => {
  it('matches the standard amortisation formula (spec example: R150 000, 12.5%, 24 months)', () => {
    expect(monthlyPayment(150000, 12.5, 24)).toBeCloseTo(7096.1, 1);
  });

  it('handles zero interest and empty loans', () => {
    expect(monthlyPayment(12000, 0, 12)).toBe(1000);
    expect(monthlyPayment(0, 12.5, 12)).toBe(0);
  });
});

describe('principalForPayment', () => {
  it('is the inverse of monthlyPayment', () => {
    const payment = monthlyPayment(80000, 15.5, 36);
    expect(principalForPayment(payment, 15.5, 36)).toBeCloseTo(80000, -1);
  });
});

describe('buildPaymentSchedule', () => {
  const schedule = buildPaymentSchedule(150000, 12.5, 24);

  it('has one row per month and pays the loan off exactly', () => {
    expect(schedule).toHaveLength(24);
    expect(schedule[23].balance).toBe(0);
    const capital = schedule.reduce((sum, row) => sum + row.principal, 0);
    expect(capital).toBeCloseTo(150000, 2);
  });

  it('splits the first payment into interest and capital', () => {
    expect(schedule[0].interest).toBe(1562.5);
    expect(schedule[0].principal + schedule[0].interest).toBeCloseTo(schedule[0].payment, 2);
  });

  it('pays less interest every month', () => {
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].interest).toBeLessThan(schedule[i - 1].interest);
    }
  });
});
