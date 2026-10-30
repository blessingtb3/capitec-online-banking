import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { filters } from '../../../../mocks/data/customer';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { TransactionsTable } from '../TransactionsTable';

const RANGE = { startDate: '2024-08-16', endDate: '2024-09-16' };

function setup(category: string | null = null) {
  const onCategoryChange = vi.fn();
  renderWithProviders(
    <TransactionsTable
      customerId="12345"
      dateRange={RANGE}
      categories={filters.categories}
      category={category}
      onCategoryChange={onCategoryChange}
    />,
  );
  return { onCategoryChange };
}

const bodyRows = () => within(screen.getByRole('table')).getAllByRole('row').slice(1);

describe('TransactionsTable', () => {
  it('shows the newest transactions first, starting with the spec examples', async () => {
    setup();
    await screen.findByRole('table');
    expect(bodyRows()).toHaveLength(10);
    expect(bodyRows()[0]).toHaveTextContent('Pick n Pay');
    expect(bodyRows()[0]).toHaveTextContent('−R245.80');
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('Showing 1–10 of 47')).toBeInTheDocument();
  });

  it('lists merchants without category icons', async () => {
    setup();
    await screen.findByRole('table');
    expect(screen.getByRole('table').querySelector('svg')).toBeNull();
    expect(bodyRows()[0]).toHaveTextContent('Weekly groceries');
  });

  it('pages through results', async () => {
    setup();
    await screen.findByRole('table');
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('Showing 11–20 of 47')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
  });

  it('only shows the selected category', async () => {
    setup('Utilities');
    await screen.findByRole('table');
    bodyRows().forEach((row) => expect(row).toHaveTextContent('Utilities'));
  });

  it('reports category changes to the parent', async () => {
    const { onCategoryChange } = setup();
    await screen.findByRole('table');
    await userEvent.selectOptions(screen.getByLabelText('Filter by category'), 'Dining');
    expect(onCategoryChange).toHaveBeenCalledWith('Dining');
  });

  it('sorts by amount', async () => {
    setup();
    await screen.findByRole('table');
    await userEvent.selectOptions(screen.getByLabelText('Sort transactions'), 'amount_desc');
    await vi.waitFor(() => {
      const amounts = bodyRows().map((row) => Number(row.lastElementChild!.textContent!.replace(/[^\d.]/g, '')));
      expect(amounts).toEqual([...amounts].sort((a, b) => b - a));
    });
  });
});
