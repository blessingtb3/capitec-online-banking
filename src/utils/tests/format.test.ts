import { formatChange, formatCurrency, formatDate, formatMonth, formatPercent, humanise } from '../format';

const NBSP = ' ';

describe('formatCurrency', () => {
  it('formats rands with space-separated thousands', () => {
    expect(formatCurrency(4250.75)).toBe(`R4${NBSP}250.75`);
    expect(formatCurrency(1500000)).toBe(`R1${NBSP}500${NBSP}000.00`);
    expect(formatCurrency(0.5)).toBe('R0.50');
  });

  it('can drop the cents', () => {
    expect(formatCurrency(179999.6, { decimals: false })).toBe(`R180${NBSP}000`);
  });

  it('formats negatives with a minus sign', () => {
    expect(formatCurrency(-245.8)).toBe('−R245.80');
  });
});

describe('formatChange', () => {
  it('signs positive and negative changes', () => {
    expect(formatChange(12.5)).toBe('+12.5%');
    expect(formatChange(-3.2)).toBe('−3.2%');
    expect(formatChange(0)).toBe('0%');
  });
});

describe('other formatters', () => {
  it('formats percentages, dates and months', () => {
    expect(formatPercent(29.4)).toBe('29.4%');
    expect(formatDate('2024-09-16T14:30:00Z')).toBe('16 Sep 2024');
    expect(formatMonth('2024-06')).toBe('Jun 2024');
    expect(formatMonth('2024-06', { short: true })).toBe('Jun');
  });

  it('humanises API enum values', () => {
    expect(humanise('home_improvement')).toBe('Home improvement');
    expect(humanise('premium')).toBe('Premium');
  });
});
