import { Doughnut } from 'react-chartjs-2';
import '../../../charts/chartSetup';
import { CategoryIcon } from '../../../components/CategoryIcon/CategoryIcon';
import { StatusMessage } from '../../../components/StatusMessage/StatusMessage';
import { colors } from '../../../theme/tokens';
import type { SpendingByCategory } from '../../../types/spending';
import { formatCurrency, formatPercent } from '../../../utils/format';
import {
  Amount,
  CenterCaption,
  CenterLabel,
  CenterValue,
  ChartWrap,
  Layout,
  List,
  Meta,
  Name,
  Row,
} from './CategoryBreakdown.styles';

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
    <Layout>
      <ChartWrap>
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
        <CenterLabel aria-hidden="true">
          <CenterCaption>Total</CenterCaption>
          <CenterValue>{formatCurrency(data.totalAmount, { decimals: false })}</CenterValue>
        </CenterLabel>
      </ChartWrap>

      <List>
        {data.categories.map((category) => {
          const selected = selectedCategory === category.name;
          return (
            <li key={category.name}>
              <Row
                type="button"
                $selected={selected}
                aria-pressed={selected}
                onClick={() => onSelectCategory(selected ? null : category.name)}
              >
                <CategoryIcon icon={category.icon} color={category.color} size={32} />
                <span>
                  <Name>{category.name}</Name>
                  <Meta>
                    {formatPercent(category.percentage)} · {category.transactionCount} transactions
                  </Meta>
                </span>
                <Amount>{formatCurrency(category.amount)}</Amount>
              </Row>
            </li>
          );
        })}
      </List>
    </Layout>
  );
}
