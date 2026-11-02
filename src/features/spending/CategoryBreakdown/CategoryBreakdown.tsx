import { Doughnut } from 'react-chartjs-2';
import '../../../charts/chartSetup';
import { CategoryIcon } from '../../../components/CategoryIcon/CategoryIcon';
import { StatusMessage } from '../../../components/StatusMessage/StatusMessage';
import { colors } from '../../../theme/tokens';
import type { SpendingByCategory } from '../../../types/spending';
import { formatCurrency, formatPercent } from '../../../utils/format';
import styles from './CategoryBreakdown.module.css';

interface CategoryBreakdownProps {
  data: SpendingByCategory;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

/**
 * Doughnut + ranked list. The list doubles as the legend and as the
 * accessible version of the chart: every colour sits next to its name and value.
 */
export function CategoryBreakdown({ data, selectedCategory, onSelectCategory }: CategoryBreakdownProps) {
  const {
    layout,
    chartWrap,
    centerLabel,
    centerCaption,
    centerValue,
    list,
    row,
    rowSelected,
    categoryName,
    meta,
    categoryAmount,
  } = styles;
  if (data.categories.length === 0) {
    return <StatusMessage variant="empty" title="No spending in this period" message="Try a longer time period." />;
  }

  const chartData = {
    labels: data.categories.map((c) => c.name),
    datasets: [
      {
        data: data.categories.map((c) => c.amount),
        backgroundColor: data.categories.map((c) => c.color),
        borderColor: colors.background,
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  return (
    <div className={layout}>
      <div className={chartWrap}>
        <Doughnut
          data={chartData}
          aria-label={`Spending by category, total ${formatCurrency(data.totalAmount)}`}
          options={{
            cutout: '68%',
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (item) => ` ${formatCurrency(Number(item.raw))} (${formatPercent(data.categories[item.dataIndex].percentage)})`,
                },
              },
            },
          }}
        />
        <div className={centerLabel} aria-hidden="true">
          <span className={centerCaption}>Total</span>
          <span className={centerValue}>{formatCurrency(data.totalAmount, { decimals: false })}</span>
        </div>
      </div>

      <ul className={list}>
        {data.categories.map((category) => {
          const selected = selectedCategory === category.name;
          return (
            <li key={category.name}>
              <button
                className={`${row} ${selected ? rowSelected : ''}`}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelectCategory(selected ? null : category.name)}
              >
                <CategoryIcon icon={category.icon} color={category.color} size={32} />
                <span>
                  <span className={categoryName}>{category.name}</span>
                  <span className={meta}>
                    {formatPercent(category.percentage)} · {category.transactionCount} transactions
                  </span>
                </span>
                <span className={categoryAmount}>{formatCurrency(category.amount)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
