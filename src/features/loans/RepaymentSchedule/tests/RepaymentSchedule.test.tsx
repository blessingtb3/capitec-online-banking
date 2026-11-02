import { render, screen, within } from '@testing-library/react';
import { buildPaymentSchedule } from '../../../../utils/loanMath';
import { RepaymentSchedule } from '../RepaymentSchedule';

describe('RepaymentSchedule', () => {
  const schedule = buildPaymentSchedule(150000, 12.5, 24);

  it('plots capital and interest for every month', () => {
    render(<RepaymentSchedule schedule={schedule} />);
    const chart = screen.getByTestId('bar-chart');
    const [capital, interest] = JSON.parse(chart.getAttribute('data-values')!);
    expect(capital).toHaveLength(24);
    expect(interest[0]).toBe(1562.5);
  });

  it('lists every month in the schedule table, ending at a zero balance', () => {
    render(<RepaymentSchedule schedule={schedule} />);
    const rows = within(screen.getByRole('table', { hidden: true })).getAllByRole('row', { hidden: true }).slice(1);
    expect(rows).toHaveLength(24);
    expect(rows[23]).toHaveTextContent('R0.00');
  });
});
