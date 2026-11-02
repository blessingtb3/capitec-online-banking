import { useState } from 'react';
import { Button } from '../../../components/Button/Button';
import { Card } from '../../../components/Card/Card';
import { StatusMessage } from '../../../components/StatusMessage/StatusMessage';
import { useGetTransactionsQuery } from '../../../services/spendingApi';
import type { DateRange, FilterCategory, SortBy } from '../../../types/spending';
import { formatCurrency, formatDate } from '../../../utils/format';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import fieldStyles from '../../../components/FormField/FormField.module.css';
import styles from './TransactionsTable.module.css';

const PAGE_SIZE = 10;

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc', label: 'Oldest first' },
  { value: 'amount_desc', label: 'Highest amount' },
  { value: 'amount_asc', label: 'Lowest amount' },
];

interface TransactionsTableProps {
  customerId: string;
  dateRange: DateRange;
  categories: FilterCategory[];
  category: string | null;
  onCategoryChange: (category: string | null) => void;
}

/**
 * Server-side filtered, sorted and paginated transactions. The parent gives
 * this component a `key` built from the filters, so paging resets to page 1
 * whenever the date range or category changes.
 */
export function TransactionsTable({ customerId, dateRange, categories, category, onCategoryChange }: TransactionsTableProps) {
  const {
    table,
    visuallyHidden,
    amountHeader,
    merchantName,
    merchantDescription,
    muted,
    amountCell,
    paginationBar,
    pageButtons,
    toolbar,
    toolbarSelect,
  } = styles;
  const { select } = fieldStyles;
  const [sortBy, setSortBy] = useState<SortBy>('date_desc');
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetTransactionsQuery({
    customerId,
    limit: PAGE_SIZE,
    offset,
    sortBy,
    category: category ?? undefined,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const renderBody = () => {
    if (isLoading) return <StatusMessage variant="loading" title="Loading transactions…" />;
    if (isError || !data) {
      return <StatusMessage variant="error" title="We couldn’t load your transactions" message={getErrorMessage(error)} onRetry={refetch} />;
    }
    if (data.transactions.length === 0) {
      return <StatusMessage variant="empty" title="No transactions found" message="Try a different category or date range." />;
    }

    const { total, hasMore } = data.pagination;
    const first = offset + 1;
    const last = offset + data.transactions.length;

    return (
      <>
        <table className={table} aria-busy={isFetching}>
          <caption className={visuallyHidden}>Transactions</caption>
          <thead>
            <tr>
              <th scope="col">Merchant</th>
              <th scope="col">Category</th>
              <th scope="col">Payment method</th>
              <th scope="col">Date</th>
              <th className={amountHeader} scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td data-column="merchant">
                  <span className={merchantName}>
                    {transaction.merchant}
                    <span className={merchantDescription}>{transaction.description}</span>
                  </span>
                </td>
                <td data-column="category">{transaction.category}</td>
                <td data-column="method">
                  <span className={muted}>{transaction.paymentMethod}</span>
                </td>
                <td data-column="date">{formatDate(transaction.date)}</td>
                <td className={amountCell} data-column="amount">−{formatCurrency(transaction.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={paginationBar}>
          <span aria-live="polite">
            Showing {first}–{last} of {total}
          </span>
          <div className={pageButtons}>
            <Button variant="secondary" size="sm" disabled={offset === 0} onClick={() => setOffset(offset - PAGE_SIZE)}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled={!hasMore} onClick={() => setOffset(offset + PAGE_SIZE)}>
              Next
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <Card
      id="transactions"
      title="Transactions"
      subtitle={`${formatDate(dateRange.startDate)} – ${formatDate(dateRange.endDate)}`}
    >
      <div className={toolbar}>
        <label className={visuallyHidden} htmlFor="transactions-category">Filter by category</label>
        <select
          className={`${select} ${toolbarSelect}`}
          id="transactions-category"
          value={category ?? ''}
          onChange={(event) => onCategoryChange(event.target.value || null)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <label className={visuallyHidden} htmlFor="transactions-sort">Sort transactions</label>
        <select
          className={`${select} ${toolbarSelect}`}
          id="transactions-sort"
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value as SortBy);
            setOffset(0);
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {renderBody()}
    </Card>
  );
}
