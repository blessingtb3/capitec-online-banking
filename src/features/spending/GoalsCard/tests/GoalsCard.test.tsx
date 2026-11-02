import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { GoalsCard } from '../GoalsCard';

describe('GoalsCard', () => {
  it('shows each goal from the API with its status and progress', async () => {
    renderWithProviders(<GoalsCard customerId="12345" />);

    expect(await screen.findByText('Entertainment')).toBeInTheDocument();
    expect(screen.getByText('On track')).toBeInTheDocument();
    expect(screen.getByText('Close to limit')).toBeInTheDocument();

    const groceries = screen.getByRole('progressbar', { name: 'Groceries budget used' });
    expect(groceries).toHaveAttribute('aria-valuenow', '97');
    expect(screen.getByText('R1 450.80 of R1 500.00')).toBeInTheDocument();
    expect(screen.getAllByText('12 days left')).toHaveLength(2);
  });

  it('shows a red bar when a budget is close to its limit, and green when on track', async () => {
    renderWithProviders(<GoalsCard customerId="12345" />);
    const groceries = await screen.findByRole('progressbar', { name: 'Groceries budget used' });
    const entertainment = screen.getByRole('progressbar', { name: 'Entertainment budget used' });
    expect(groceries.firstElementChild).toHaveAttribute('data-tone', 'accentRed');
    expect(entertainment.firstElementChild).toHaveAttribute('data-tone', 'success');
  });
});
