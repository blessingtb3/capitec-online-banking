import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { SpendingInsightsPage } from '../SpendingInsightsPage';

async function renderPage(route = '/spending-insights') {
  renderWithProviders(<SpendingInsightsPage customerId="12345" />, { route });
  await screen.findByRole('heading', { level: 1, name: 'John, here’s your spending' });
}

const activePanel = () => screen.getByRole('tabpanel');

describe('SpendingInsightsPage', () => {
  it('opens on the Overview tab, showing the summary and categories together', async () => {
    await renderPage();
    expect(screen.getByText(/Premium account · customer since Jan 2023/)).toBeInTheDocument();
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['Overview', 'Trends', 'Transactions']);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(await within(activePanel()).findByText('Total spent')).toBeInTheDocument();
    expect(within(activePanel()).getByRole('region', { name: 'Spending by category' })).toBeInTheDocument();
    expect(await within(activePanel()).findByTestId('doughnut-chart')).toBeInTheDocument();
    expect(document.title).toBe('Spending insights · Capitec');
  });

  it.each(['summary', 'categories', 'budgets'])('sends old ?tab=%s links to the Overview tab', async (oldTab) => {
    await renderPage(`/spending-insights?tab=${oldTab}`);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  });

  it('opens the tab named in the URL', async () => {
    await renderPage('/spending-insights?tab=trends');
    expect(screen.getByRole('tabpanel', { name: 'Trends' })).toBeInTheDocument();
    expect(await within(activePanel()).findByTestId('bar-chart')).toBeInTheDocument();
  });

  it('only shows the period filter on tabs that use it', async () => {
    await renderPage();
    expect(screen.getByRole('group', { name: 'Time period' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: 'Trends' }));
    expect(screen.queryByRole('group', { name: 'Time period' })).not.toBeInTheDocument();
    expect(within(activePanel()).getByRole('group', { name: 'Months to show' })).toBeInTheDocument();
  });

  it('jumps to filtered transactions when a category is chosen', async () => {
    await renderPage();
    await userEvent.click(await within(activePanel()).findByRole('button', { name: /Transportation/ }));

    expect(screen.getByRole('tab', { name: 'Transactions' })).toHaveAttribute('aria-selected', 'true');
    expect(within(activePanel()).getByLabelText('Filter by category')).toHaveValue('Transportation');
    await vi.waitFor(() => {
      const rows = within(within(activePanel()).getByRole('table')).getAllByRole('row').slice(1);
      expect(rows.length).toBeGreaterThan(0);
      rows.forEach((row) => expect(row).toHaveTextContent('Transportation'));
    });
  });

  it('shows this calendar month on the overview, including monthly budgets', async () => {
    await renderPage();
    await within(activePanel()).findByText('Total spent');
    await userEvent.click(screen.getByRole('button', { name: 'This month' }));
    expect(await within(activePanel()).findByText(/^1 Sep 2024 – 16 Sep 2024 · select a category/)).toBeInTheDocument();
    expect(await within(activePanel()).findByText('R1 977.57')).toBeInTheDocument();
    expect(within(activePanel()).getByText('−12% vs this time last month')).toBeInTheDocument();
    expect(within(activePanel()).getByRole('region', { name: 'Monthly budgets' })).toBeInTheDocument();
    expect(await within(activePanel()).findByText('Close to limit')).toBeInTheDocument();
  });

  it.each(['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last year'])(
    'hides monthly budgets for "%s"',
    async (preset) => {
      await renderPage();
      await userEvent.click(screen.getByRole('button', { name: 'This month' }));
      expect(await within(activePanel()).findByRole('region', { name: 'Monthly budgets' })).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: preset }));
      expect(within(activePanel()).queryByRole('region', { name: 'Monthly budgets' })).not.toBeInTheDocument();
    },
  );

  it('applies a custom date range to transactions', async () => {
    await renderPage('/spending-insights?tab=transactions');
    await userEvent.click(screen.getByRole('button', { name: 'Custom dates' }));
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2024-07-01' } });
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2024-07-31' } });
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(await within(activePanel()).findByText('1 Jul 2024 – 31 Jul 2024')).toBeInTheDocument();
  });

  it('updates the tiles and categories together when the period changes', async () => {
    await renderPage();
    await within(activePanel()).findByText('Total spent');
    expect(screen.queryByRole('button', { name: 'Custom dates' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Last 7 days' }));
    expect(screen.getByRole('button', { name: 'Last 7 days' })).toHaveAttribute('aria-pressed', 'true');
    await vi.waitFor(() => expect(within(activePanel()).getByText('13')).toBeInTheDocument());
    expect(await within(activePanel()).findByText(/^10 Sep 2024 – 16 Sep 2024 · select a category/)).toBeInTheDocument();
  });
});
