import { useState } from 'react';
import { Button } from '../../../components/Button/Button';
import { Card } from '../../../components/Card/Card';
import { CategoryIcon } from '../../../components/CategoryIcon/CategoryIcon';
import { StatusMessage } from '../../../components/StatusMessage/StatusMessage';
import { useGetTransactionsQuery } from '../../../services/spendingApi';
import type { DateRange, FilterCategory, SortBy } from '../../../types/spending';
import { formatCurrency, formatDate } from '../../../utils/format';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import {
  AmountCell,
  AmountHeader,
  Description,
  HiddenCaption,
  HiddenLabel,
  Merchant,
  Muted,
  PageButtons,
  Pagination,
  Table,
  Toolbar,
  ToolbarSelect,
} from './TransactionsTable.styles';

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
        <Table aria-busy={isFetching}>
          <HiddenCaption>Transactions</HiddenCaption>
          <thead>
            <tr>
              <th scope="col">Merchant</th>
              <th scope="col">Category</th>
              <th scope="col">Payment method</th>
              <th scope="col">Date</th>
              <AmountHeader scope="col">Amount</AmountHeader>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td data-column="merchant">
                  <Merchant>
                    <CategoryIcon icon={transaction.icon} color={transaction.categoryColor} size={34} />
                    <span>
                      {transaction.merchant}
                      <Description>{transaction.description}</Description>
                    </span>
                  </Merchant>
                </td>
                <td data-column="category">{transaction.category}</td>
                <td data-column="method">
                  <Muted>{transaction.paymentMethod}</Muted>
                </td>
                <td data-column="date">{formatDate(transaction.date)}</td>
                <AmountCell>−{formatCurrency(transaction.amount)}</AmountCell>
              </tr>
            ))}
          </tbody>
        </Table>

        <Pagination>
          <span aria-live="polite">
            Showing {first}–{last} of {total}
          </span>
          <PageButtons>
            <Button variant="secondary" size="sm" disabled={offset === 0} onClick={() => setOffset(offset - PAGE_SIZE)}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled={!hasMore} onClick={() => setOffset(offset + PAGE_SIZE)}>
              Next
            </Button>
          </PageButtons>
        </Pagination>
      </>
    );
  };

  return (
    <Card
      id="transactions"
      title="Transactions"
      subtitle={`${formatDate(dateRange.startDate)} – ${formatDate(dateRange.endDate)}`}
    >
      <Toolbar>
        <HiddenLabel htmlFor="transactions-category">Filter by category</HiddenLabel>
        <ToolbarSelect
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
        </ToolbarSelect>
        <HiddenLabel htmlFor="transactions-sort">Sort transactions</HiddenLabel>
        <ToolbarSelect
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
        </ToolbarSelect>
      </Toolbar>
      {renderBody()}
    </Card>
  );
}
