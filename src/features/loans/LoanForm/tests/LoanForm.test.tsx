import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { loanProducts, validationRules } from '../../../../mocks/data/loans';
import { LoanForm } from '../LoanForm';

function setup() {
  const onSubmit = vi.fn();
  render(<LoanForm products={loanProducts.products} rules={validationRules} isSubmitting={false} onSubmit={onSubmit} />);
  return { onSubmit, user: userEvent.setup() };
}

describe('LoanForm', () => {
  it('shows the API validation messages and focuses the first invalid field', async () => {
    const { onSubmit, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Check my eligibility' }));

    expect(screen.getByText('Age must be between 18 and 65')).toBeInTheDocument();
    expect(screen.getByText('Please select your employment status')).toBeInTheDocument();
    expect(screen.getByText('Minimum monthly income of R5,000 required')).toBeInTheDocument();
    expect(screen.getByText('Loan amount must be between R5,000 and R300,000')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/Please fix \d+ fields/);
    expect(screen.getByLabelText('Age')).toHaveFocus();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears a field’s error as soon as it is edited', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Check my eligibility' }));
    await user.type(screen.getByLabelText('Age'), '30');
    expect(screen.queryByText('Age must be between 18 and 65')).not.toBeInTheDocument();
  });

  it('submits the spec example as an API request', async () => {
    const { onSubmit, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Use example values' }));
    await user.click(screen.getByRole('button', { name: 'Check my eligibility' }));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        personalInfo: { age: 35, employmentStatus: 'employed', employmentDuration: 24 },
        financialInfo: { monthlyIncome: 25000, monthlyExpenses: 15000, existingDebt: 5000, creditScore: 650 },
        loanDetails: { requestedAmount: 150000, loanTerm: 24, loanPurpose: 'home_improvement' },
      },
      expect.objectContaining({ id: 'personal_loan' }),
    );
  });

  it('uses the vehicle product’s limits and purposes', async () => {
    const { user } = setup();
    // People click the product card (the radio's label); the radio itself is visually hidden.
    await user.click(screen.getByText('Vehicle Finance'));
    expect(screen.getByRole('radio', { name: /Vehicle Finance/ })).toBeChecked();
    expect(screen.getByRole('option', { name: 'New vehicle' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Education' })).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('Loan amount'), '20000');
    await user.click(screen.getByRole('button', { name: 'Check my eligibility' }));
    expect(screen.getByText('Loan amount must be between R50,000 and R1,500,000')).toBeInTheDocument();
  });

  it('does not ask for employment duration when unemployed or retired', async () => {
    const { user } = setup();
    await user.selectOptions(screen.getByLabelText('Employment status'), 'retired');
    expect(screen.getByLabelText('Months in current employment')).toBeDisabled();
  });

  it('can start with a product preselected', () => {
    render(
      <LoanForm
        products={loanProducts.products}
        rules={validationRules}
        isSubmitting={false}
        onSubmit={() => {}}
        initialProductId="vehicle_loan"
      />,
    );
    expect(screen.getByRole('radio', { name: /Vehicle Finance/ })).toBeChecked();
  });
});
