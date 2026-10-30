import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import '../../../charts/chartSetup';
import { Card } from '../../../components/Card/Card';
import { SegmentedControl } from '../../../components/SegmentedControl/SegmentedControl';
import { StatusMessage } from '../../../components/StatusMessage/StatusMessage';
import { useGetSpendingTrendsQuery } from '../../../services/spendingApi';
import { colors } from '../../../theme/tokens';
import { formatCurrency, formatMonth } from '../../../utils/format';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { ChartArea } from './SpendingTrendsChart.styles';

const MONTH_OPTIONS = [
  { value: 6, label: '6M' },
  { value: 12, label: '12M' },
  { value: 24, label: '24M' },
];

export function SpendingTrendsChart({ customerId }: { customerId: string }) {
  const [months, setMonths] = useState(12);
  const { data, isLoading, isFetching, isError, error, refetch } = useGetSpendingTrendsQuery({ customerId, months });

  const renderBody = () => {
    if (isLoading) return <StatusMessage variant="loading" title="Loading trends…" />;
    if (isError || !data) {
      return <StatusMessage variant="error" title="We couldn’t load your trends" message={getErrorMessage(error)} onRetry={refetch} />;
    }
    const { trends } = data;
    return (
      <ChartArea aria-busy={isFetching}>
        <Bar
          aria-label={`Monthly spending for the last ${months} months`}
          data={{
            labels: trends.map((t) => formatMonth(t.month, { short: months > 6 })),
            datasets: [
              {
                label: 'Total spent',
                data: trends.map((t) => t.totalSpent),
                backgroundColor: colors.primaryButtonBackground,
                hoverBackgroundColor: colors.buttonHoverBackground,
                borderRadius: 4,
                maxBarThickness: 40,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  title: (items) => formatMonth(trends[items[0].dataIndex].month),
                  label: (item) => {
                    const trend = trends[item.dataIndex];
                    return [
                      ` ${formatCurrency(trend.totalSpent)}`,
                      ` ${trend.transactionCount} transactions`,
                      ` ${formatCurrency(trend.averageTransaction)} average`,
                    ];
                  },
                },
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                beginAtZero: true,
                ticks: { callback: (value) => `R${Number(value) / 1000}k` },
              },
            },
          }}
        />
      </ChartArea>
    );
  };

  return (
    <Card
      id="spending-trends"
      title="Monthly spending"
      subtitle="Total spent per month"
      actions={<SegmentedControl label="Months to show" options={MONTH_OPTIONS} value={months} onChange={setMonths} />}
    >
      {renderBody()}
    </Card>
  );
}
