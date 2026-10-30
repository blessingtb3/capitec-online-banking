import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithProviders } from '../test-utils/renderWithProviders';

describe('App', () => {
  it('redirects the home page to spending insights and greets the customer', async () => {
    renderWithProviders(<App />, { route: '/' });
    expect(await screen.findByText('Hi, John')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 1, name: 'John, here’s your spending' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Spending insights' })).toHaveAttribute('aria-current', 'page');
  });

  it('navigates to the loan estimator page', async () => {
    renderWithProviders(<App />, { route: '/spending-insights' });
    await userEvent.click(screen.getByRole('link', { name: 'Loan estimator' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'See what you could borrow' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Loan estimator' })).toHaveAttribute('aria-current', 'page');
  });

  it('shows a not-found page for unknown URLs', () => {
    renderWithProviders(<App />, { route: '/nowhere' });
    expect(screen.getByRole('heading', { name: 'We can’t find that page' })).toBeInTheDocument();
  });
});
