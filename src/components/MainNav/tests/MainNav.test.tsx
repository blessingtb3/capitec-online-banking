import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MainNav } from '../MainNav';

describe('MainNav', () => {
  it('links to both pages and marks the current one', () => {
    render(
      <MemoryRouter initialEntries={['/loan-estimator']}>
        <MainNav />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Spending insights' })).toHaveAttribute('href', '/spending-insights');
    expect(screen.getByRole('link', { name: 'Loan estimator' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Spending insights' })).not.toHaveAttribute('aria-current');
  });
});
