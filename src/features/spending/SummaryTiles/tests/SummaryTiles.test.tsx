import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { SummaryTiles } from '../SummaryTiles';

describe('SummaryTiles', () => {
  it('shows a loading state, then the 30-day summary from the API', async () => {
    renderWithProviders(<SummaryTiles customerId="12345" period="30d" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading your summary…');

    expect(await screen.findByText('Total spent')).toBeInTheDocument();
    expect(screen.getByText('R4 261.63')).toBeInTheDocument();
    expect(screen.getByText('47')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('+5.7% vs previous period')).toBeInTheDocument();
  });

  it('compares this month with the same point last month', async () => {
    renderWithProviders(<SummaryTiles customerId="12345" period="mtd" />);
    expect(await screen.findByText('R1 977.57')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('−12% vs this time last month')).toBeInTheDocument();
  });

  it('shows an error with retry for an unknown customer', async () => {
    renderWithProviders(<SummaryTiles customerId="nobody" period="30d" />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Customer nobody not found');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
