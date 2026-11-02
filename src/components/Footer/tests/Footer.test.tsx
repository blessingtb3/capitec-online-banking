import { render, screen, within } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('shows the logo and every link column', () => {
    render(<Footer />);
    expect(screen.getByRole('img', { name: 'Capitec' })).toHaveAttribute('src', expect.stringContaining('capitec-logo-black'));
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Get in touch',
      'Personal',
      'Business',
      'Rewards',
      'Company',
    ]);
    expect(within(screen.getByRole('region', { name: 'Rewards' })).getByRole('link', { name: 'Cash back' })).toHaveAttribute(
      'href',
      'https://www.capitecbank.co.za/rewards/bank-better/',
    );
  });

  it('keeps the concept project disclaimer', () => {
    render(<Footer />);
    expect(screen.getByText(/not affiliated with Capitec Bank/)).toBeInTheDocument();
  });
});
