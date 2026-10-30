import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { loanProducts, validationRules } from '../../../../mocks/data/loans';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { RepaymentCalculator } from '../RepaymentCalculator';

function setup() {
  renderWithProviders(<RepaymentCalculator products={loanProducts.products} rules={validationRules} />);
  return userEvent.setup();
}

describe('RepaymentCalculator', () => {
  it('calculates the spec example and shows the schedule', async () => {
    const user = setup();
    await user.type(screen.getByLabelText('Loan amount'), '150000');
    await user.type(screen.getByLabelText('Loan term (months)'), '24');
    await user.type(screen.getByLabelText('Credit score'), '650');
    await user.click(screen.getByRole('button', { name: 'Calculate repayments' }));

    expect(await screen.findByTestId('calc-monthly-payment')).toHaveTextContent('R7 096.10');
    expect(screen.getByText('12.5%')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('validates against the selected product’s limits', async () => {
    const user = setup();
    await user.selectOptions(screen.getByLabelText('Loan type'), 'vehicle_loan');
    await user.type(screen.getByLabelText('Loan amount'), '20000');
    await user.type(screen.getByLabelText('Loan term (months)'), '6');
    await user.click(screen.getByRole('button', { name: 'Calculate repayments' }));

    expect(screen.getByText('Enter an amount between R50 000 and R1 500 000')).toBeInTheDocument();
    expect(screen.getByText('Enter a term between 12 and 72 months')).toBeInTheDocument();
    expect(screen.getByLabelText('Loan amount')).toHaveFocus();
  });

  it('uses the API’s credit score rule', async () => {
    const user = setup();
    await user.type(screen.getByLabelText('Loan amount'), '50000');
    await user.type(screen.getByLabelText('Loan term (months)'), '12');
    await user.type(screen.getByLabelText('Credit score'), '900');
    await user.click(screen.getByRole('button', { name: 'Calculate repayments' }));
    expect(screen.getByText('Credit score must be between 300 and 850')).toBeInTheDocument();
  });
});
