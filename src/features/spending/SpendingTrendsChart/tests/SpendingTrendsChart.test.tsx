import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { SpendingTrendsChart } from '../SpendingTrendsChart';

const plottedLabels = () => JSON.parse(screen.getByTestId('bar-chart').getAttribute('data-labels')!);

describe('SpendingTrendsChart', () => {
  it('plots the last 12 months by default', async () => {
    renderWithProviders(<SpendingTrendsChart customerId="12345" />);
    await screen.findByTestId('bar-chart');
    expect(plottedLabels()).toHaveLength(12);
    expect(screen.getByRole('button', { name: '12M' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('refetches when the month range changes', async () => {
    renderWithProviders(<SpendingTrendsChart customerId="12345" />);
    await screen.findByTestId('bar-chart');
    await userEvent.click(screen.getByRole('button', { name: '6M' }));
    await vi.waitFor(() => expect(plottedLabels()).toEqual(['Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024']));
  });
});
