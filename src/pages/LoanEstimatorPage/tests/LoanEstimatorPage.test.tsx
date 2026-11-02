import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { LoanEstimatorPage } from '../LoanEstimatorPage';

async function renderPage(route = '/loan-estimator') {
  renderWithProviders(<LoanEstimatorPage />, { route });
  await screen.findByRole('tabpanel');
}

const activePanel = () => screen.getByRole('tabpanel');

describe('LoanEstimatorPage', () => {
  it('opens on the Loan products tab, listed first', async () => {
    await renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'See what you could borrow' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Loan products',
      'Eligibility',
      'Repayment calculator',
    ]);
    expect(screen.getByRole('tab', { name: 'Loan products' })).toHaveAttribute('aria-selected', 'true');
    expect(within(activePanel()).getByRole('button', { name: 'Check eligibility for Personal Loan' })).toBeInTheDocument();
    expect(document.title).toBe('Loan estimator · Capitec');
  });

  it('opens the tab named in the URL', async () => {
    await renderPage('/loan-estimator?tab=calculator');
    expect(within(activePanel()).getByRole('form', { name: 'Repayment calculator' })).toBeInTheDocument();
  });

  it('starts an eligibility check for a product chosen on the products tab', async () => {
    await renderPage();
    await userEvent.click(within(activePanel()).getByRole('button', { name: 'Check eligibility for Vehicle Finance' }));
    expect(screen.getByRole('tab', { name: 'Eligibility' })).toHaveAttribute('aria-selected', 'true');
    expect(within(activePanel()).getByRole('radio', { name: /Vehicle Finance/ })).toBeChecked();
  });

  it('keeps what you typed when switching tabs', async () => {
    await renderPage('/loan-estimator?tab=eligibility');
    await userEvent.type(within(activePanel()).getByLabelText('Age'), '35');
    await userEvent.click(screen.getByRole('tab', { name: 'Loan products' }));
    await userEvent.click(screen.getByRole('tab', { name: 'Eligibility' }));
    expect(within(activePanel()).getByLabelText('Age')).toHaveValue('35');
  });
});
