import { StatusMessage } from '../../../components/StatusMessage/StatusMessage';
import { useGetSpendingSummaryQuery } from '../../../services/spendingApi';
import type { Period } from '../../../types/spending';
import { formatChange, formatCurrency } from '../../../utils/format';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import styles from './SummaryTiles.module.css';

interface SummaryTilesProps {
  customerId: string;
  period: Period;
}

/** Describes a change in words, so meaning never depends on colour or arrows alone. */
const describeChange = (change: number, noun: string, period: Period) => {
  const comparedWith = period === 'mtd' ? 'this time last month' : 'previous period';
  return change === 0 ? `Same ${noun} as ${comparedWith}` : `${formatChange(change)} vs ${comparedWith}`;
};

export function SummaryTiles({ customerId, period }: SummaryTilesProps) {
  const { tileGrid, tile, blue, tileLabel, tileValue, tileNote, navy, slate, red } = styles;
  const { data, isLoading, isError, error, refetch } = useGetSpendingSummaryQuery({ customerId, period });

  if (isLoading) return <StatusMessage variant="loading" title="Loading your summary…" />;
  if (isError || !data) {
    return <StatusMessage variant="error" title="We couldn’t load your summary" message={getErrorMessage(error)} onRetry={refetch} />;
  }

  return (
    <section className={tileGrid} aria-label="Spending summary">
      <div className={`${tile} ${blue}`}>
        <p className={tileLabel}>Total spent</p>
        <p className={tileValue}>{formatCurrency(data.totalSpent)}</p>
        <p className={tileNote}>{describeChange(data.comparedToPrevious.spentChange, 'spend', period)}</p>
      </div>
      <div className={`${tile} ${navy}`}>
        <p className={tileLabel}>Transactions</p>
        <p className={tileValue}>{data.transactionCount}</p>
        <p className={tileNote}>{describeChange(data.comparedToPrevious.transactionChange, 'number', period)}</p>
      </div>
      <div className={`${tile} ${slate}`}>
        <p className={tileLabel}>Average transaction</p>
        <p className={tileValue}>{formatCurrency(data.averageTransaction)}</p>
        <p className={tileNote}>per purchase</p>
      </div>
      <div className={`${tile} ${red}`}>
        <p className={tileLabel}>Top category</p>
        <p className={tileValue}>{data.topCategory ?? '—'}</p>
        <p className={tileNote}>where most of your money went</p>
      </div>
    </section>
  );
}
