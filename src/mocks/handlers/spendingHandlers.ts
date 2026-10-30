import type {
  CategoryParams,
  CategorySpend,
  DateRange,
  Period,
  SortBy,
  SpendingByCategory,
  SpendingSummary,
  SpendingTrends,
  Transaction,
  TransactionParams,
  TransactionsResponse,
} from '../../types/spending';
import { addDays, addMonths, daysBetweenInclusive, isValidIsoDate } from '../../utils/dates';
import { roundToCents } from '../../utils/loanMath';
import { CUSTOMER_ID, filters, MOCK_TODAY } from '../data/customer';
import { monthlyTrends } from '../data/trends';
import { transactions as allTransactions } from '../data/transactions';
import { MockHttpError } from '../MockHttpError';

const PERIODS: Period[] = ['mtd', '7d', '30d', '90d', '1y'];
const SORTS: SortBy[] = ['date_desc', 'date_asc', 'amount_desc', 'amount_asc'];

export function assertCustomer(customerId: string): void {
  if (customerId !== CUSTOMER_ID) throw new MockHttpError(404, `Customer ${customerId} not found`);
}

function parsePeriod(value: unknown): Period {
  if (value === undefined || value === '') return '30d';
  if (PERIODS.includes(value as Period)) return value as Period;
  throw new MockHttpError(400, `Invalid period "${String(value)}". Use one of ${PERIODS.join(', ')}.`);
}

/** The date window a period covers, ending on the mock "today". */
export function rangeForPeriod(period: Period, endDate = MOCK_TODAY): DateRange {
  const startDate = {
    mtd: `${endDate.slice(0, 7)}-01`,
    '7d': addDays(endDate, -6),
    '30d': addMonths(endDate, -1),
    '90d': addMonths(endDate, -3),
    '1y': addMonths(endDate, -12),
  }[period];
  return { startDate, endDate };
}

/** The window of equal length immediately before `range`. */
export function previousRange(range: DateRange): DateRange {
  const length = daysBetweenInclusive(range.startDate, range.endDate);
  return { startDate: addDays(range.startDate, -length), endDate: addDays(range.startDate, -1) };
}

/**
 * What a period is compared with. Month to date is compared with the same
 * point last month (1–16 Aug for 1–16 Sep), not the 16 days before it.
 */
export function comparisonRange(period: Period, range: DateRange): DateRange {
  if (period !== 'mtd') return previousRange(range);
  return { startDate: addMonths(range.startDate, -1), endDate: addMonths(range.endDate, -1) };
}

/** Custom start/end dates win over the period, as described in the spec. */
function resolveRange(params: { period?: unknown; startDate?: string; endDate?: string }): DateRange {
  const { startDate, endDate } = params;
  if (startDate || endDate) {
    if (!startDate || !endDate) throw new MockHttpError(400, 'Provide both startDate and endDate.');
    if (!isValidIsoDate(startDate) || !isValidIsoDate(endDate)) {
      throw new MockHttpError(400, 'Dates must use the YYYY-MM-DD format.');
    }
    if (startDate > endDate) throw new MockHttpError(400, 'startDate must be on or before endDate.');
    return { startDate, endDate };
  }
  return rangeForPeriod(parsePeriod(params.period));
}

function inRange(transactions: Transaction[], range: DateRange): Transaction[] {
  // ISO dates compare correctly as strings.
  return transactions.filter((t) => {
    const day = t.date.slice(0, 10);
    return day >= range.startDate && day <= range.endDate;
  });
}

const sum = (transactions: Transaction[]) => transactions.reduce((total, t) => total + t.amount, 0);

const percentChange = (current: number, previous: number) =>
  previous === 0 ? 0 : Math.round(((current - previous) / previous) * 1000) / 10;

function categoryTotals(transactions: Transaction[]): CategorySpend[] {
  const total = sum(transactions);
  return filters.categories
    .map((category) => {
      const inCategory = transactions.filter((t) => t.category === category.name);
      const amount = roundToCents(sum(inCategory));
      return {
        name: category.name,
        amount,
        percentage: total === 0 ? 0 : Math.round((amount / total) * 1000) / 10,
        transactionCount: inCategory.length,
        color: category.color,
        icon: category.icon,
      };
    })
    .filter((category) => category.transactionCount > 0)
    .sort((a, b) => b.amount - a.amount);
}

/* ------------------------------------------------------------------ */
/* Endpoint handlers                                                   */
/* ------------------------------------------------------------------ */

export function getSpendingSummary(params: { period?: unknown }): SpendingSummary {
  const period = parsePeriod(params.period);
  const range = rangeForPeriod(period);
  const current = inRange(allTransactions, range);
  const previous = inRange(allTransactions, comparisonRange(period, range));
  const totalSpent = roundToCents(sum(current));

  return {
    period,
    totalSpent,
    transactionCount: current.length,
    averageTransaction: current.length ? roundToCents(totalSpent / current.length) : 0,
    topCategory: categoryTotals(current)[0]?.name ?? null,
    comparedToPrevious: {
      spentChange: percentChange(totalSpent, sum(previous)),
      transactionChange: percentChange(current.length, previous.length),
    },
  };
}

export function getSpendingByCategory(params: CategoryParams): SpendingByCategory {
  const dateRange = resolveRange(params);
  const current = inRange(allTransactions, dateRange);
  return {
    dateRange,
    totalAmount: roundToCents(sum(current)),
    categories: categoryTotals(current),
  };
}

export function getSpendingTrends(params: { months?: unknown }): SpendingTrends {
  const requested = params.months === undefined ? 12 : Number(params.months);
  if (!Number.isInteger(requested) || requested < 1 || requested > 24) {
    throw new MockHttpError(400, 'months must be a whole number between 1 and 24.');
  }
  return { trends: monthlyTrends.slice(-requested) };
}

const SORTERS: Record<SortBy, (a: Transaction, b: Transaction) => number> = {
  date_desc: (a, b) => b.date.localeCompare(a.date),
  date_asc: (a, b) => a.date.localeCompare(b.date),
  amount_desc: (a, b) => b.amount - a.amount,
  amount_asc: (a, b) => a.amount - b.amount,
};

export function getTransactions(params: TransactionParams): TransactionsResponse {
  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;
  const sortBy = params.sortBy ?? 'date_desc';

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new MockHttpError(400, 'limit must be between 1 and 100.');
  }
  if (!Number.isInteger(offset) || offset < 0) throw new MockHttpError(400, 'offset must be 0 or more.');
  if (!SORTS.includes(sortBy)) throw new MockHttpError(400, `Invalid sortBy "${sortBy}".`);

  let result = allTransactions;
  if (params.category) result = result.filter((t) => t.category === params.category);
  if (params.startDate || params.endDate) result = inRange(result, resolveRange(params));
  result = [...result].sort(SORTERS[sortBy]);

  return {
    transactions: result.slice(offset, offset + limit),
    pagination: { total: result.length, limit, offset, hasMore: offset + limit < result.length },
  };
}
