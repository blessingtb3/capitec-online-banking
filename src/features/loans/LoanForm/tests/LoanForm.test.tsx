import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { loanProducts, validationRules } from '../../../../mocks/data/loans';
import { LoanForm } from '../LoanForm';

function setup() {
  const onSubmit = vi.fn();
  render(<LoanForm products={loanProducts.products} rules={validationRules} isSubmitting={false} onSubmit={onSubmit} />);
  return { onSubmit, user: userEvent.setup() };
}

type User = ReturnType<typeof userEvent.setup>;

/** Fills every required field. Defaults are valid; pass overrides to make some invalid. */
async function fillRequired(
  user: User,
  overrides: Partial<Record<'age' | 'duration' | 'income' | 'expenses' | 'amount' | 'term' | 'purpose', string>> = {},
) {
  const v = { age: '35', duration: '24', income: '25000', expenses: '15000', amount: '150000', term: '24', purpose: 'home_improvement', ...overrides };
  await user.type(screen.getByLabelText('Age'), v.age);
  await user.selectOptions(screen.getByLabelText('Employment status'), 'employed');
  await user.type(screen.getByLabelText('Months in current employment'), v.duration);
  await user.type(screen.getByLabelText('Monthly income'), v.income);
  await user.type(screen.getByLabelText('Monthly expenses'), v.expenses);
  await user.selectOptions(screen.getByLabelText('What is it for?'), v.purpose);
  await user.type(screen.getByLabelText('Loan amount'), v.amount);
  await user.type(screen.getByLabelText('Loan term (months)'), v.term);
}

describe('LoanForm', () => {
  it('disables the button, with an explanation, until the required fields are filled', async () => {
    const { user } = setup();
    const button = screen.getByRole('button', { name: 'Check my eligibility' });
    expect(button).toBeDisabled();
    expect(button).toHaveAccessibleDescription('Fill in all the required fields to check your eligibility.');

    await fillRequired(user);
    expect(button).toBeEnabled();
    expect(screen.queryByText('Fill in all the required fields to check your eligibility.')).not.toBeInTheDocument();
  });

  it('does not need the optional existing debt and credit score fields', async () => {
    const { onSubmit, user } = setup();
    await fillRequired(user);
    expect(screen.getByLabelText('Existing debt repayments')).toHaveValue('');
    expect(screen.getByLabelText('Credit score')).toHaveValue('');
    await user.click(screen.getByRole('button', { name: 'Check my eligibility' }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('disables the button again if a required field is cleared', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Use example values' }));
    expect(screen.getByRole('button', { name: 'Check my eligibility' })).toBeEnabled();
    await user.clear(screen.getByLabelText('Monthly income'));
    expect(screen.getByRole('button', { name: 'Check my eligibility' })).toBeDisabled();
  });

  it('shows the API validation messages and focuses the first invalid field', async () => {
    const { onSubmit, user } = setup();
    await fillRequired(user, { age: '17', duration: '2', income: '4000', amount: '1000' });
    await user.click(screen.getByRole('button', { name: 'Check my eligibility' }));

    expect(screen.getByText('Age must be between 18 and 65')).toBeInTheDocument();
    expect(screen.getByText('Minimum 3 months employment required')).toBeInTheDocument();
    expect(screen.getByText('Minimum monthly income of R5,000 required')).toBeInTheDocument();
    expect(screen.getByText('Loan amount must be between R5,000 and R300,000')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Please fix 4 fields');
    expect(screen.getByLabelText('Age')).toHaveFocus();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears a field’s error as soon as it is edited', async () => {
    const { user } = setup();
    await fillRequired(user, { age: '17' });
    await user.click(screen.getByRole('button', { name: 'Check my eligibility' }));
    expect(screen.getByText('Age must be between 18 and 65')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Age'), '0');
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

    await fillRequired(user, { amount: '20000', purpose: 'new_vehicle' });
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

  it('reports loan type changes, including from the example values', async () => {
    const onProductChange = vi.fn();
    render(
      <LoanForm
        products={loanProducts.products}
        rules={validationRules}
        isSubmitting={false}
        onSubmit={() => {}}
        onProductChange={onProductChange}
      />,
    );
    const user = userEvent.setup();
    await user.click(screen.getByText('Vehicle Finance'));
    expect(onProductChange).toHaveBeenLastCalledWith('vehicle_loan');
    await user.click(screen.getByRole('button', { name: 'Use example values' }));
    expect(onProductChange).toHaveBeenLastCalledWith('personal_loan');
  });
});
