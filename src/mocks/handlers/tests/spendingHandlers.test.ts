import { MockHttpError } from '../../MockHttpError';
import {
  comparisonRange,
  getSpendingByCategory,
  getSpendingSummary,
  getSpendingTrends,
  getTransactions,
  previousRange,
  rangeForPeriod,
} from '../spendingHandlers';

describe('date ranges', () => {
  it('matches the spec’s 30-day range', () => {
    expect(rangeForPeriod('30d')).toEqual({ startDate: '2024-08-16', endDate: '2024-09-16' });
  });

  it('treats "this month" as the calendar month to date', () => {
    expect(rangeForPeriod('mtd')).toEqual({ startDate: '2024-09-01', endDate: '2024-09-16' });
    expect(rangeForPeriod('mtd', '2024-03-31')).toEqual({ startDate: '2024-03-01', endDate: '2024-03-31' });
  });

  it('compares this month with the same point last month', () => {
    expect(comparisonRange('mtd', rangeForPeriod('mtd'))).toEqual({ startDate: '2024-08-01', endDate: '2024-08-16' });
    // 31 March compares with the end of February, not 2 or 3 March.
    expect(comparisonRange('mtd', rangeForPeriod('mtd', '2024-03-31'))).toEqual({ startDate: '2024-02-01', endDate: '2024-02-29' });
  });

  it('compares other periods with the window just before them', () => {
    expect(comparisonRange('7d', rangeForPeriod('7d'))).toEqual({ startDate: '2024-09-03', endDate: '2024-09-09' });
  });

  it('builds the previous range of equal length', () => {
    expect(previousRange({ startDate: '2024-09-10', endDate: '2024-09-16' })).toEqual({
      startDate: '2024-09-03',
      endDate: '2024-09-09',
    });
  });
});

describe('getSpendingSummary', () => {
  it('returns the spec shape, with 30 days closely matching the spec’s figures', () => {
    const summary = getSpendingSummary({ period: '30d' });
    expect(summary.period).toBe('30d');
    expect(summary.transactionCount).toBe(47);
    expect(summary.totalSpent).toBeCloseTo(4261.63, 2);
    expect(summary.averageTransaction).toBeCloseTo(summary.totalSpent / 47, 2);
    expect(summary.topCategory).toBe('Groceries');
    expect(summary.comparedToPrevious).toEqual({ spentChange: expect.any(Number), transactionChange: expect.any(Number) });
  });

  it('supports the month-to-date period', () => {
    const summary = getSpendingSummary({ period: 'mtd' });
    expect(summary).toMatchObject({ period: 'mtd', transactionCount: 20, totalSpent: 1977.57 });
    expect(getSpendingByCategory({ period: 'mtd' }).dateRange).toEqual({ startDate: '2024-09-01', endDate: '2024-09-16' });
  });

  it('defaults to 30 days and rejects unknown periods', () => {
    expect(getSpendingSummary({}).period).toBe('30d');
    expect(() => getSpendingSummary({ period: '2w' })).toThrow(MockHttpError);
  });
});

describe('getSpendingByCategory', () => {
  it('returns categories that add up to the total, largest first', () => {
    const result = getSpendingByCategory({ period: '90d' });
    const sum = result.categories.reduce((total, c) => total + c.amount, 0);
    expect(sum).toBeCloseTo(result.totalAmount, 2);
    const percentages = result.categories.reduce((total, c) => total + c.percentage, 0);
    expect(percentages).toBeGreaterThan(99.5);
    expect(percentages).toBeLessThan(100.5);
    const amounts = result.categories.map((c) => c.amount);
    expect(amounts).toEqual([...amounts].sort((a, b) => b - a));
  });

  it('lets custom dates override the period', () => {
    const result = getSpendingByCategory({ period: '7d', startDate: '2024-07-01', endDate: '2024-07-31' });
    expect(result.dateRange).toEqual({ startDate: '2024-07-01', endDate: '2024-07-31' });
  });

  it('rejects bad custom ranges', () => {
    expect(() => getSpendingByCategory({ startDate: '2024-07-31', endDate: '2024-07-01' })).toThrow(/on or before/);
    expect(() => getSpendingByCategory({ startDate: '2024-07-01' })).toThrow(/both/);
    expect(() => getSpendingByCategory({ startDate: '01/07/2024', endDate: '2024-07-31' })).toThrow(/YYYY-MM-DD/);
  });
});

describe('getSpendingTrends', () => {
  it('returns the requested number of months, newest last, with spec values intact', () => {
    const { trends } = getSpendingTrends({ months: 12 });
    expect(trends).toHaveLength(12);
    expect(trends.at(-1)!.month).toBe('2024-09');
    expect(trends.find((t) => t.month === '2024-01')).toEqual({
      month: '2024-01',
      totalSpent: 3890.25,
      transactionCount: 42,
      averageTransaction: 92.62,
    });
  });

  it('defaults to 12 and enforces the 24-month maximum', () => {
    expect(getSpendingTrends({}).trends).toHaveLength(12);
    expect(getSpendingTrends({ months: 24 }).trends).toHaveLength(24);
    expect(() => getSpendingTrends({ months: 25 })).toThrow(MockHttpError);
  });
});

describe('getTransactions', () => {
  it('defaults to 20 newest-first transactions, starting with the spec examples', () => {
    const { transactions, pagination } = getTransactions({});
    expect(transactions).toHaveLength(20);
    expect(transactions[0].id).toBe('txn_123456');
    expect(transactions.map((t) => t.id)).toContain('txn_123457');
    const dates = transactions.map((t) => t.date);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(pagination).toMatchObject({ limit: 20, offset: 0, hasMore: true });
  });

  it('filters by category and date range', () => {
    const { transactions } = getTransactions({ category: 'Dining', startDate: '2024-08-01', endDate: '2024-08-31', limit: 100 });
    expect(transactions.length).toBeGreaterThan(0);
    transactions.forEach((t) => {
      expect(t.category).toBe('Dining');
      expect(t.date.slice(0, 10) >= '2024-08-01' && t.date.slice(0, 10) <= '2024-08-31').toBe(true);
    });
  });

  it('paginates without overlap', () => {
    const first = getTransactions({ limit: 5, offset: 0 }).transactions.map((t) => t.id);
    const second = getTransactions({ limit: 5, offset: 5 }).transactions.map((t) => t.id);
    expect(first.filter((id) => second.includes(id))).toEqual([]);
  });

  it('sorts by amount', () => {
    const amounts = getTransactions({ sortBy: 'amount_asc', limit: 50 }).transactions.map((t) => t.amount);
    expect(amounts).toEqual([...amounts].sort((a, b) => a - b));
  });

  it('validates limit and sortBy', () => {
    expect(() => getTransactions({ limit: 101 })).toThrow(/limit/);
    expect(() => getTransactions({ sortBy: 'name' as never })).toThrow(/sortBy/);
  });
});
