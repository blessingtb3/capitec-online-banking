import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { loanProducts, validationRules } from '../../../../mocks/data/loans';
import { EligibilityChecker } from '../EligibilityChecker';

async function renderSimulator() {
  const user = userEvent.setup();
  renderWithProviders(<EligibilityChecker products={loanProducts.products} rules={validationRules} />);
  await screen.findByRole('form', { name: 'Loan eligibility' });
  return user;
}

describe('EligibilityChecker', () => {
  it('shows a placeholder before the first check', async () => {
    await renderSimulator();
    expect(screen.getByRole('radio', { name: /Personal Loan/ })).toBeChecked();
    expect(screen.getByText('Your estimate will appear here')).toBeInTheDocument();
  });

  it('checks the spec example end to end and shows the result and schedule', async () => {
    const user = await renderSimulator();
    await user.click(screen.getByRole('button', { name: 'Use example values' }));
    await user.click(screen.getByRole('button', { name: 'Check my eligibility' }));

    expect(await screen.findByRole('heading', { name: 'You’re likely to qualify' })).toBeInTheDocument();
    expect(screen.getByTestId('monthly-payment')).toHaveTextContent('R7 096.10');
    expect(screen.getByText('12.5%')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Repayment schedule' })).toBeInTheDocument();
  });

  it('explains a decline when expenses exceed income', async () => {
    const user = await renderSimulator();
    await user.click(screen.getByRole('button', { name: 'Use example values' }));
    await user.clear(screen.getByLabelText('Monthly expenses'));
    await user.type(screen.getByLabelText('Monthly expenses'), '26000');
    await user.click(screen.getByRole('button', { name: 'Check my eligibility' }));

    expect(await screen.findByRole('heading', { name: 'You’re unlikely to qualify right now' })).toBeInTheDocument();
    expect(screen.getByText(/expenses are equal to or higher than monthly income/)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Repayment schedule' })).not.toBeInTheDocument();
  });

  it('declines unemployed applicants with a clear reason', async () => {
    const user = await renderSimulator();
    await user.click(screen.getByRole('button', { name: 'Use example values' }));
    await user.selectOptions(screen.getByLabelText('Employment status'), 'unemployed');
    await user.click(screen.getByRole('button', { name: 'Check my eligibility' }));
    expect(await screen.findByText(/regular income from employment/)).toBeInTheDocument();
  });
});
