import { Bar } from 'react-chartjs-2';
import '../../../charts/chartSetup';
import { colors } from '../../../theme/tokens';
import type { PaymentScheduleRow } from '../../../types/loans';
import { formatCurrency } from '../../../utils/format';
import styles from './RepaymentSchedule.module.css';

/** Stacked bars of interest vs capital per month, plus the full table. */
export function RepaymentSchedule({ schedule }: { schedule: PaymentScheduleRow[] }) {
  const { chartArea, details, scrollArea, scheduleTable } = styles;
  return (
    <div>
      <div className={chartArea}>
        <Bar
          aria-label="Monthly repayment split between capital and interest"
          data={{
            labels: schedule.map((row) => `${row.month}`),
            datasets: [
              {
                label: 'Capital',
                data: schedule.map((row) => row.principal),
                backgroundColor: colors.heading,
                borderRadius: 2,
              },
              {
                label: 'Interest',
                data: schedule.map((row) => row.interest),
                backgroundColor: colors.primaryButtonBackground,
                borderRadius: 2,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  title: (items) => `Month ${items[0].label}`,
                  label: (item) => ` ${item.dataset.label}: ${formatCurrency(Number(item.raw))}`,
                },
              },
            },
            scales: {
              x: { stacked: true, grid: { display: false }, title: { display: true, text: 'Month' } },
              y: { stacked: true, beginAtZero: true, ticks: { callback: (value) => formatCurrency(Number(value), { decimals: false }) } },
            },
          }}
        />
      </div>

      <details className={details}>
        <summary>View full repayment schedule</summary>
        <div className={scrollArea}>
          <table className={scheduleTable}>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Payment</th>
                <th scope="col">Capital</th>
                <th scope="col">Interest</th>
                <th scope="col">Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.month}>
                  <td>{row.month}</td>
                  <td>{formatCurrency(row.payment)}</td>
                  <td>{formatCurrency(row.principal)}</td>
                  <td>{formatCurrency(row.interest)}</td>
                  <td>{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
