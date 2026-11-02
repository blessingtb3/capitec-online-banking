import { Card } from '../../../components/Card/Card';
import { ProgressBar } from '../../../components/ProgressBar/ProgressBar';
import { StatusMessage } from '../../../components/StatusMessage/StatusMessage';
import { useGetGoalsQuery } from '../../../services/spendingApi';
import type { GoalStatus } from '../../../types/spending';
import { formatCurrency, formatPercent } from '../../../utils/format';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import styles from './GoalsCard.module.css';

const STATUS_LABEL: Record<GoalStatus, string> = {
  on_track: 'On track',
  warning: 'Close to limit',
  exceeded: 'Over budget',
};

/** Bar colour per status: close to the limit shows red, the same as over budget. */
const STATUS_TONE = { on_track: 'success', warning: 'error', exceeded: 'error' } as const;

export function GoalsCard({ customerId }: { customerId: string }) {
  const { goalList, goalItem, goalHead, goalName, statusBadge, goalMeta } = styles;
  const { data, isLoading, isError, error, refetch } = useGetGoalsQuery(customerId);

  const renderBody = () => {
    if (isLoading) return <StatusMessage variant="loading" title="Loading budgets…" />;
    if (isError || !data) {
      return <StatusMessage variant="error" title="We couldn’t load your budgets" message={getErrorMessage(error)} onRetry={refetch} />;
    }
    if (data.goals.length === 0) {
      return <StatusMessage variant="empty" title="No budgets yet" message="Set a monthly budget to track your spending." />;
    }
    return (
      <ul className={goalList}>
        {data.goals.map((goal) => (
          <li className={goalItem} key={goal.id}>
            <div className={goalHead}>
              <span className={goalName}>{goal.category}</span>
              <span className={`${statusBadge} ${styles[goal.status]}`}>{STATUS_LABEL[goal.status]}</span>
            </div>
            <ProgressBar
              value={goal.percentageUsed}
              tone={STATUS_TONE[goal.status]}
              label={`${goal.category} budget used`}
              valueText={`${formatPercent(goal.percentageUsed)} of ${formatCurrency(goal.monthlyBudget)} used`}
            />
            <p className={goalMeta}>
              <span>
                {formatCurrency(goal.currentSpent)} of {formatCurrency(goal.monthlyBudget)}
              </span>
              <span>{goal.daysRemaining} days left</span>
            </p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card id="spending-goals" title="Monthly budgets" subtitle="This calendar month">
      {renderBody()}
    </Card>
  );
}
