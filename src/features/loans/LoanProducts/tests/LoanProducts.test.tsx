import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { loanProducts } from '../../../../mocks/data/loans';
import { LoanProducts } from '../LoanProducts';

describe('LoanProducts', () => {
  it('lists each product with its limits, rates and purposes', () => {
    render(<LoanProducts products={loanProducts.products} onCheckEligibility={() => {}} />);
    const vehicle = screen.getByRole('listitem', { name: 'Vehicle Finance' });
    expect(within(vehicle).getByText('R50 000 – R1 500 000')).toBeInTheDocument();
    expect(within(vehicle).getByText('12–72 months')).toBeInTheDocument();
    expect(within(vehicle).getByText('8.5%–15%')).toBeInTheDocument();
    expect(within(vehicle).getByText('Used vehicle')).toBeInTheDocument();
  });

  it('starts an eligibility check for the chosen product', async () => {
    const onCheck = vi.fn();
    render(<LoanProducts products={loanProducts.products} onCheckEligibility={onCheck} />);
    await userEvent.click(screen.getByRole('button', { name: 'Check eligibility for Vehicle Finance' }));
    expect(onCheck).toHaveBeenCalledWith('vehicle_loan');
  });
});
