import { StatusMessage } from '../../../components/StatusMessage/StatusMessage';
import { useGetSpendingSummaryQuery } from '../../../services/spendingApi';
import type { Period } from '../../../types/spending';
import { formatChange, formatCurrency } from '../../../utils/format';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { Tile, TileGrid, TileLabel, TileNote, TileValue } from './SummaryTiles.styles';

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
  const { data, isLoading, isError, error, refetch } = useGetSpendingSummaryQuery({ customerId, period });

  if (isLoading) return <StatusMessage variant="loading" title="Loading your summary…" />;
  if (isError || !data) {
    return <StatusMessage variant="error" title="We couldn’t load your summary" message={getErrorMessage(error)} onRetry={refetch} />;
  }

  return (
    <TileGrid aria-label="Spending summary">
      <Tile $tone="blue">
        <TileLabel>Total spent</TileLabel>
        <TileValue>{formatCurrency(data.totalSpent)}</TileValue>
        <TileNote>{describeChange(data.comparedToPrevious.spentChange, 'spend', period)}</TileNote>
      </Tile>
      <Tile $tone="navy">
        <TileLabel>Transactions</TileLabel>
        <TileValue>{data.transactionCount}</TileValue>
        <TileNote>{describeChange(data.comparedToPrevious.transactionChange, 'number', period)}</TileNote>
      </Tile>
      <Tile $tone="slate">
        <TileLabel>Average transaction</TileLabel>
        <TileValue>{formatCurrency(data.averageTransaction)}</TileValue>
        <TileNote>per purchase</TileNote>
      </Tile>
      <Tile $tone="red">
        <TileLabel>Top category</TileLabel>
        <TileValue>{data.topCategory ?? '—'}</TileValue>
        <TileNote>where most of your money went</TileNote>
      </Tile>
    </TileGrid>
  );
}
